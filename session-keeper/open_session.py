#!/usr/bin/env python3
"""
open_session.py - launches a VISIBLE chrome window logged into v0.app/vercel
using the Netscape cookie file. On Ctrl+C, live cookies are re-exported to
the source file so a fresh session can be captured: sign in manually, then
close.
"""
import asyncio
import http.cookiejar
import sys
from datetime import datetime
from pathlib import Path

from playwright.async_api import async_playwright

DEFAULT_COOKIES = "/home/alae/Downloads/cookies.txt"
ALLOWED_DOMAINS = ("v0.app", "vercel.app", "vercel.com")


def log(msg: str) -> None:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)


def load_cookies(path: str, allowed: tuple) -> list:
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    cookies = []
    for c in jar:
        if not any(d in c.domain for d in allowed):
            continue
        cookies.append({
            "name": c.name,
            "value": c.value,
            "domain": c.domain,
            "path": c.path or "/",
            "secure": c.secure,
            "expires": int(c.expires) if c.expires else -1,
        })
    return cookies


def dump_cookies(cookies: list, path: str) -> None:
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


async def main() -> None:
    cookies_file = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_COOKIES
    target = sys.argv[2] if len(sys.argv) > 2 else "https://v0.app"
    cookie_path = Path(cookies_file).expanduser()
    if not cookie_path.exists():
        raise SystemExit(f"cookies file not found: {cookie_path}")

    cookies = load_cookies(str(cookie_path), ALLOWED_DOMAINS)
    log(f"loaded {len(cookies)} v0/vercel cookies from {cookie_path}")

    browser = ctx = None
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=False,
                executable_path="/usr/bin/google-chrome-stable",
                args=["--no-sandbox"],
            )
            ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
            await ctx.add_cookies(cookies)
            page = await ctx.new_page()
            await page.goto(target, wait_until="domcontentloaded", timeout=60000)
            log(f"opened {page.url}")
            log("sign in manually if prompted; press Ctrl+C when logged in - cookies get re-exported")
            while True:
                await asyncio.sleep(3600)
    except KeyboardInterrupt:
        pass
    finally:
        if ctx:
            dump_cookies(await ctx.cookies(), str(cookie_path))
            log(f"live cookies saved to {cookie_path}")
        if browser:
            await browser.close()
        log("closed")


if __name__ == "__main__":
    asyncio.run(main())
