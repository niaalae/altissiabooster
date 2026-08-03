#!/usr/bin/env python3
"""check_v0_session.py - headless check: does the v0.app cookie session work?"""
import asyncio, http.cookiejar, sys
from pathlib import Path
from playwright.async_api import async_playwright

COOKIES = sys.argv[1] if len(sys.argv) > 1 else "/home/alae/Downloads/cookies.txt"
ALLOWED = ("v0.app", "vercel.app", "vercel.com")

def load(path):
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    return [{"name": c.name, "value": c.value, "domain": c.domain,
             "path": c.path or "/", "secure": c.secure,
             "expires": int(c.expires) if c.expires else -1} for c in jar
            if any(d in c.domain for d in ALLOWED)]

async def main():
    cookies = load(COOKIES)
    print(f"loaded {len(cookies)} cookies")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path="/usr/bin/google-chrome-stable", args=["--no-sandbox"])
        ctx = await browser.new_context()
        await ctx.add_cookies(cookies)
        page = await ctx.new_page()
        await page.goto("https://v0.app", wait_until="domcontentloaded", timeout=45000)
        await page.wait_for_timeout(6000)
        print(f"URL: {page.url}")
        html = await page.content()
        marks = {
            "sign-in form": ("sign-in" in page.url) or "Sign in" in html,
            "login button": ("Log in" in html or "Sign in" in html),
            "user identity shown": ("alan" in html.lower() and ("avatar" in html.lower() or "profile" in html.lower())),
        }
        for k, v in marks.items():
            print(f"  {k}: {v}")
        title = await page.title()
        print(f"title: {title}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
