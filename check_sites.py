#!/usr/bin/env python3
import json
import time
import requests
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

WORKERS = 20
TIMEOUT = 30


def check_site(url):
    try:
        resp = requests.get(url, timeout=TIMEOUT, allow_redirects=False)
        if resp.status_code == 200:
            return (url, True, "OK")
        else:
            return (url, False, f"HTTP {resp.status_code}")
    except requests.exceptions.Timeout:
        return (url, False, "TIMEOUT")
    except requests.exceptions.TooManyRedirects:
        return (url, False, "REDIRECTS")
    except Exception as e:
        return (url, False, str(e)[:30])


def main():
    with open("links.json", "r") as f:
        links = json.load(f)

    total = len(links)
    print(f"Checking {total} links with {WORKERS} workers...")
    print(f"Estimated time: ~{total * TIMEOUT // WORKERS} seconds\n")

    working = []
    not_working = []
    results_list = []

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(check_site, link): link for link in links}

        for i, future in enumerate(as_completed(futures)):
            result = future.result()
            results_list.append(result)
            url, is_working, status = result
            print(f"[{i + 1}/{total}] {status}")

            if is_working:
                working.append(url)
            else:
                not_working.append(url)

    print("\n" + "=" * 80)
    print(f"{'URL':<60} | {'STATUS':<15}")
    print("=" * 80)
    for result in results_list:
        if not result[1]:
            print(f"{result[0][:60]:<60} | {result[2]:<15}")
    print("=" * 80)

    print(f"\nSUMMARY:")
    print(f"  Total:  {total}")
    print(f"  Good:  {len(working)}")
    print(f"  Bad:   {len(not_working)}")

    with open("check_results.json", "w") as f:
        json.dump(
            {
                "timestamp": datetime.now().isoformat(),
                "total": total,
                "working": working,
                "not_working": not_working,
            },
            f,
            indent=2,
        )

    print(f"\nResults saved to check_results.json")


if __name__ == "__main__":
    main()
