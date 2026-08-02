#!/usr/bin/env python3
"""
session_keeper.py - keeps authenticated browser tabs alive forever.

Reads links + settings from config.json, loads Netscape cookies into a
browser context (all tabs share the same session), opens one tab per link,
and refreshes every tab in PARALLEL every refresh_interval_seconds,
in an endless loop.
"""
import asyncio
import http.cookiejar
import json
import os
from datetime import datetime
from pathlib import Path

from playwright.async_api import async_playwright

CONFIG_PATH = Path(__file__).parent / "config.json"


def log(msg: str) -> None:
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text())


def load_cookies(path: str) -> list:
    if not os.path.isabs(path):
        path = str(CONFIG_PATH.parent / path)
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    cookies = []
    for c in jar:
        cookies.append({
            "name": c.name,
            "value": c.value,
            "domain": c.domain,
            "path": c.path or "/",
            "secure": c.secure,
            "expires": int(c.expires) if c.expires else -1,
        })
    return cookies


async def dump_cookies(context, path: str) -> None:
    if not os.path.isabs(path):
        path = str(CONFIG_PATH.parent / path)
    cookies = await context.cookies()
    lines = ["# Netscape HTTP Cookie File"]
    for c in cookies:
        domain = c["domain"]
        if c.get("httpOnly"):
            domain = "#HttpOnly_" + domain
        lines.append("\t".join([
            domain,
            "TRUE" if c["domain"].startswith(".") else "FALSE",
            c["path"],
            "TRUE" if c.get("secure") else "FALSE",
            str(int(c["expires"])) if c.get("expires") and c["expires"] > 0 else "",
            c["name"], c["value"],
        ]))
    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")


async def open_tab(context, url: str):
    page = await context.new_page()
    await page.goto(url, wait_until="domcontentloaded", timeout=60000)
    await page.wait_for_timeout(1000)
    return page


async def refresh_one(page, label: str):
    try:
        await page.reload(wait_until="commit", timeout=45000)
        if label == "login" and ("/login" in page.url or "sign-in" in page.url):
            log(f"  WARNING: {page.url} redirected to login - session may be expired")
        else:
            log(f"  refreshed [{label}]: {page.url}")
    except Exception as e:
        log(f"  refresh failed [{label}] ({page.url}): {e}")
    return page


async def refresh_tabs(pages: list, label: str) -> list:
    return await asyncio.gather(*(refresh_one(p, label) for p in pages))


async def run_keeper() -> None:
    cfg = load_config()
    links = cfg.get("links", [])
    if not links:
        raise SystemExit("config.json has no links - add at least one URL")

    interval = int(cfg.get("refresh_interval_seconds", 300))
    headless = bool(cfg.get("headless", False))
    guest_tabs = bool(cfg.get("guest_tabs", False))
    no_sandbox = bool(cfg.get("no_sandbox", False))
    executable_path = cfg.get("executable_path") or None
    cookies_file = cfg.get("cookies_file", "")

    tab_total = len(links) * (2 if guest_tabs else 1)
    log(f"session_keeper started: {len(links)} link(s) x "
        f"{'login+guest' if guest_tabs else 'login-only'} = {tab_total} tab(s), "
        f"refresh every {interval}s, headless={headless}, "
        f"executable={executable_path or 'bundled'}")
    log(f"loading cookies from {cookies_file}")
    cookies = load_cookies(cookies_file)
    log(f"loaded {len(cookies)} cookies")

    launch_args = ["--no-sandbox"] if no_sandbox else []

    async with async_playwright() as p:
        while True:
            browser = None
            try:
                log("launching browser...")
                browser = await p.chromium.launch(
                    headless=headless, executable_path=executable_path, args=launch_args)

                login_ctx = await browser.new_context(viewport={"width": 900, "height": 700})
                await login_ctx.add_cookies(cookies)
                log("cookies injected into login context")

                guest_ctx = await browser.new_context(viewport={"width": 900, "height": 700})
                log("guest context created (no cookies)")

                login_pages = [await open_tab(login_ctx, url) for url in links]
                log(f"opened {len(login_pages)} login tab(s)")
                guest_pages = [await open_tab(guest_ctx, url) for url in links] if guest_tabs else []
                if guest_pages:
                    log(f"opened {len(guest_pages)} guest tab(s)")

                while True:
                    await asyncio.sleep(interval)
                    log(f"refreshing {len(login_pages) + len(guest_pages)} tab(s) in parallel...")
                    try:
                        login_pages, guest_pages = await asyncio.gather(
                            refresh_tabs(login_pages, label="login"),
                            refresh_tabs(guest_pages, label="guest"))
                        await dump_cookies(login_ctx, cookies_file)
                        log(f"live cookies re-exported to {cookies_file} (auto-refresh)")
                    except Exception as e:
                        if browser and not browser.is_connected():
                            raise
                        log(f"cycle hiccup (browser kept alive): {e}")
            except KeyboardInterrupt:
                log("stopped by user")
                break
            except Exception as e:
                log(f"cycle error: {e}")
            finally:
                if browser:
                    try:
                        await browser.close()
                    except Exception:
                        pass
                log("restarting cycle in 10s...")
                await asyncio.sleep(10)


def main() -> None:
    try:
        asyncio.run(run_keeper())
    except KeyboardInterrupt:
        log("stopped by user")


if __name__ == "__main__":
    main()
