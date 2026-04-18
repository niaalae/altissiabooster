#!/usr/bin/env python3
import json
import subprocess
import time


def main():
    with open("links.json", "r") as f:
        links = json.load(f)

    latest_14 = links[-14:]

    for i, link in enumerate(latest_14):
        print(f"[{i + 1}/14] Opening {link}")
        subprocess.Popen(["xdg-open", link])
        time.sleep(0.5)

    print(f"\nOpened {len(latest_14)} links in browser")


if __name__ == "__main__":
    main()
