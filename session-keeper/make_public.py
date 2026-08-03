#!/usr/bin/env python3
"""make_public.py - open each link in a visible browser and set share visibility to "Anyone with the link".

Only marks a link as fixed when the "chat privacy updated" confirmation appears.
Already-public links are skipped; links showing errors/"not found" are skipped.

Usage: ./venv/bin/python make_public.py [acc] [limit] [--headless]
Persists fixed links to instances/<acc>/public-links.txt (resume-safe).
"""
import asyncio, http.cookiejar, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

ACC = sys.argv[1] if len(sys.argv) > 1 else "acc2"
LIMIT = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].lstrip("-").isdigit() else 0
OFFSET = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].lstrip("-").isdigit() else 0
HEADLESS = "--headless" in sys.argv
BASE = Path(__file__).parent
LINKS = json.load(open(BASE / f"instances/{ACC}/config.json"))["links"]
OUT = BASE / f"instances/{ACC}/public-links.txt"
ALLOWED = ("v0.app", "vercel.app", "vercel.com")
CONFIRM_TEXT = "chat privacy updated"

def load(path):
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    return [{"name": c.name, "value": c.value, "domain": c.domain,
             "path": c.path or "/", "secure": c.secure,
             "expires": int(c.expires) if c.expires else -1} for c in jar
            if any(d in c.domain for d in ALLOWED)]

async def main():
    cookies = load(BASE / f"instances/{ACC}/cookies.txt")
    print(f"loaded {len(cookies)} cookies for {ACC}")
    done = set(OUT.read_text().splitlines()) if OUT.exists() else set()
    fixed = list(done)
    todo = LINKS[OFFSET:OFFSET + LIMIT] if LIMIT else LINKS
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=HEADLESS,
            executable_path="/usr/bin/google-chrome-stable",
            args=["--no-sandbox"])
        ctx = await browser.new_context()
        await ctx.add_cookies(cookies)
        page = await ctx.new_page()
        for i, url in enumerate(todo, 1):
            if url in done:
                print(f"[{i}/{len(todo)}] skip (already public)")
                continue
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=45000)
                await page.wait_for_timeout(2500)
                body = await page.inner_text("body")
                if "not found" in body.lower() or "404" in body:
                    print(f"[{i}/{len(todo)}] skip (not found/404)")
                    continue
                share = page.locator('button[aria-label="Share"]')
                if await share.count() == 0:
                    print(f"[{i}/{len(todo)}] no share button: {url}")
                    continue
                await share.click()
                await page.wait_for_timeout(1000)
                dialog = page.locator('[role="dialog"]')
                combo = dialog.locator('button[role="combobox"]')
                await combo.wait_for(timeout=8000)
                text = await combo.inner_text()
                if "Anyone with the link" in text:
                    print(f"[{i}/{len(todo)}] skip (already public)")
                    await page.keyboard.press("Escape")
                    continue
                await combo.click()
                await page.wait_for_timeout(800)
                opt = page.locator('[role="option"], [role="menuitem"]').filter(has_text="Anyone with the link").first
                await opt.click()
                try:
                    await page.get_by_text(CONFIRM_TEXT, exact=False).first.wait_for(timeout=6000)
                except Exception:
                    print(f"[{i}/{len(todo)}] no confirmation toast (value stayed {text!r})")
                    await page.keyboard.press("Escape")
                    continue
                fixed.append(url); OUT.write_text("\n".join(fixed) + "\n")
                print(f"[{i}/{len(todo)}] FIXED -> public + confirmed")
                await page.keyboard.press("Escape")
            except Exception as e:
                print(f"[{i}/{len(todo)}] error: {e}")
        await browser.close()
    print(f"done: {len(fixed) - len(done)} new of {len(todo)}, total public: {len(fixed)}")

if __name__ == "__main__":
    asyncio.run(main())
