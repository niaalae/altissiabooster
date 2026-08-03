#!/usr/bin/env python3
"""test_cross.py - visible chrome: acc1 link under acc2's session (tab 1) + same link in guest/incognito (tab 2)."""
import asyncio, http.cookiejar, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = Path(__file__).parent
URL = sys.argv[1] if len(sys.argv) > 1 else json.load(open(BASE / "instances/acc1/config.json"))["links"][0]
ACC = sys.argv[2] if len(sys.argv) > 2 else "acc2"
ALLOWED = ("v0.app", "vercel.app", "vercel.com")

def load(path):
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    return [{"name": c.name, "value": c.value, "domain": c.domain,
             "path": c.path or "/", "secure": c.secure,
             "expires": int(c.expires) if c.expires else -1} for c in jar
            if any(d in c.domain for d in ALLOWED)]

async def main():
    cookies = load(BASE / f"instances/{ACC}/cookies.txt")
    print(f"URL: {URL}\nloaded {len(cookies)} cookies from {ACC}")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            executable_path="/usr/bin/google-chrome-stable",
            args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        await ctx.add_cookies(cookies)
        await ctx.new_page()
        await ctx.pages[0].goto(URL, wait_until="domcontentloaded", timeout=60000)
        guest = await browser.new_context(viewport={"width": 1280, "height": 800})
        gpage = await guest.new_page()
        await gpage.goto(URL, wait_until="domcontentloaded", timeout=60000)
        print("opened both tabs; Ctrl+C to close")
        while True:
            await asyncio.sleep(3600)

if __name__ == "__main__":
    asyncio.run(main())
