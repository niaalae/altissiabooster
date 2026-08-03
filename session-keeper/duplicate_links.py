#!/usr/bin/env python3
"""duplicate_links.py - duplicate a source v0 chat N times under a given account session,
make each copy public ("Anyone with the link"), save links to JSON+TXT.

Usage: ./venv/bin/python duplicate_links.py [acc] [count] [source_url]
Resume-safe: reads existing links.json and continues until count reached.
"""
import asyncio, http.cookiejar, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

ACC = sys.argv[1] if len(sys.argv) > 1 else "acc4"
COUNT = int(sys.argv[2]) if len(sys.argv) > 2 else 70
SOURCE = next((a for a in sys.argv[3:] if not a.startswith("--")), "https://v0.app/alanenniaa/chat/web-termife-2-Hne9YrOQ8E8")
HEADLESS = "--headless" in sys.argv
BASE = Path(__file__).parent
OUT_JSON = BASE / f"instances/{ACC}/links.json"
OUT_TXT = BASE / f"instances/{ACC}/links.txt"
ALLOWED = ("v0.app", "vercel.app", "vercel.com")

def load(path):
    jar = http.cookiejar.MozillaCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    return [{"name": c.name, "value": c.value, "domain": c.domain,
             "path": c.path or "/", "secure": c.secure,
             "expires": int(c.expires) if c.expires else -1} for c in jar
            if any(d in c.domain for d in ALLOWED)]

async def try_click(page, locator, timeout=8000):
    try:
        await locator.click(timeout=timeout)
        return True
    except Exception:
        return False

def dup_btns(page, in_dialog=False):
    scope = page.locator('[role="dialog"]') if in_dialog else page.locator("body")
    return scope.locator("button", has_text="Duplicate")

async def main():
    cookies = load(BASE / f"instances/{ACC}/cookies.txt")
    print(f"loaded {len(cookies)} cookies for {ACC}")
    links = json.loads(OUT_JSON.read_text()) if OUT_JSON.exists() else []
    print(f"current saved: {len(links)}/{COUNT}")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=HEADLESS,
            executable_path="/usr/bin/google-chrome-stable",
            args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        await ctx.add_cookies(cookies)
        page = await ctx.new_page()
        while len(links) < COUNT:
            n = len(links) + 1
            print(f"\n--- cycle {n}/{COUNT} ---")
            try:
                await page.goto(SOURCE, wait_until="domcontentloaded", timeout=45000)
                await page.wait_for_timeout(6000)
                await page.keyboard.press("Escape")
                await page.wait_for_timeout(500)

                # Duplicate modal may already be open (re-visit); detect submit-in-dialog first
                modal_submit = page.locator('[role="dialog"] button', has_text="Duplicate")
                if await modal_submit.count() == 0:
                    dup = dup_btns(page).first
                    if not await try_click(page, dup, timeout=6000):
                        print(f"[{n}] Duplicate button not found")
                        continue
                    await page.wait_for_timeout(1000)
                    modal_submit = page.locator('[role="dialog"] button', has_text="Duplicate")

                cb = page.locator('[role="dialog"] [role="checkbox"]')
                if await cb.count() and await cb.get_attribute("aria-checked") != "true":
                    await cb.click()
                await page.wait_for_timeout(500)

                scope = page.locator('[role="dialog"] button[aria-haspopup="menu"]').first
                if not await try_click(page, scope, timeout=3000):
                    scope2 = page.locator('[role="dialog"] button', has_text="Select scope").first
                    if not await try_click(page, scope2, timeout=3000):
                        print(f"[{n}] scope dropdown not found")
                        continue
                await page.wait_for_timeout(600)

                item = page.locator('[role="menuitem"], [role="option"]').first
                if not await try_click(page, item, timeout=3000):
                    print(f"[{n}] scope option not found")
                    continue
                await page.wait_for_timeout(600)

                submit = modal_submit.filter(has_text="Duplicate").last
                if not await try_click(page, submit, timeout=4000):
                    print(f"[{n}] submit duplicate not found/disabled")
                    continue

                new_url = ""
                for _ in range(12):
                    await page.wait_for_timeout(800)
                    cur = page.url
                    if "/chat/" in cur and not cur.endswith("web-termife-2-Hne9YrOQ8E8"):
                        new_url = cur
                        break
                if not new_url:
                    print(f"[{n}] redirect timeout")
                    continue
                print(f"[{n}] created {new_url}")

                share = page.locator('button[aria-label="Share"]')
                if await try_click(page, share, timeout=15000):
                    await page.wait_for_timeout(1200)
                    dialog = page.locator('[role="dialog"]')
                    combo = dialog.locator('button[role="combobox"]')
                    text = await combo.inner_text() if await combo.count() else ""
                    if "Anyone with the link" not in text and await try_click(page, combo):
                        await page.wait_for_timeout(1000)
                        opt = page.locator('[role="option"], [role="menuitem"]').filter(has_text="Anyone with the link").first
                        await try_click(page, opt, timeout=3000)
                        await page.wait_for_timeout(1200)
                        print(f"[{n}] visibility set to Anyone with the link")
                    else:
                        print(f"[{n}] already public (or no combo)")
                    await page.keyboard.press("Escape")

                links.append(new_url)
                OUT_JSON.write_text(json.dumps(links, indent=2))
                OUT_TXT.write_text("\n".join(links) + "\n")
                print(f"[{n}] saved ({len(links)}/{COUNT})")
            except Exception as e:
                print(f"[{n}] error: {e}")
        await browser.close()
    print(f"done: {len(links)} links -> {OUT_TXT}")

if __name__ == "__main__":
    asyncio.run(main())
