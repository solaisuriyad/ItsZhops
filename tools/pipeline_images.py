#!/usr/bin/env python3
"""Fetch/normalize product images for ItsZhop.

For each mapping, try to fetch the ORIGINAL image (decoded from the Brave
thumbnail URL's base64 suffix), fall back to the local thumbnail, then
resize to <= 900px and save as optimized JPEG.
"""
import base64, os, subprocess, sys, urllib.request

SRC = "image-search"
OUT = "assets/img/products"
os.makedirs(OUT, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}

# product-id : source thumbnail filename
MAPPING = {
    # Crochet & Handmade
    "cr-teddy":           "handmade-crochet-amigurumi-teddy-bear-to-1.jpg",
    "cr-teddy-lavender":  "handmade-crochet-amigurumi-teddy-bear-to-3.jpg",
    "cr-bunny":           "crochet-bunny-doll-elephant-amigurumi-ha-1.jpg",
    "cr-bunny-sleep":     "crochet-bunny-doll-elephant-amigurumi-ha-2.jpg",
    "cr-keychain-set":    "crochet-keychain-flower-bouquet-sunflowe-2.jpg",
    "cr-keychain-sunflower": "crochet-keychain-flower-bouquet-sunflowe-3.jpg",
    "cr-tote-yarn":       "handmade-crochet-bag-yarn-1.png",
    "cr-crossbody-rose":  "handmade-crochet-bag-yarn-2.jpg",
    # Shopping Bags
    "bag-jute-classic":   "eco-friendly-cotton-tote-bag-reusable-sh-3.jpg",
    "bag-jute-leather":   "eco-friendly-cotton-tote-bag-reusable-sh-5.jpg",
    "bag-cotton-tote":    "eco-friendly-cotton-tote-bag-reusable-sh-2.png",
    "bag-patchwork":      "canvas-grocery-bag-cloth-patchwork-tote--2.jpg",
    "bag-quilted":        "canvas-grocery-bag-cloth-patchwork-tote--1.jpg",
    "bag-jhola":          "canvas-grocery-bag-cloth-patchwork-tote--5.jpg",
    # Women's Handbags
    "hb-rattan":          "women-leather-handbag-shoulder-bag-elega-1.png",
    "hb-elegant-tote":    "women-leather-handbag-shoulder-bag-elega-2.jpg",
    "hb-ilara":           "women-leather-handbag-shoulder-bag-elega-5.jpg",
    "hb-sling-khaki":     "women-tote-bag-crossbody-sling-bag-fashi-2.jpg",
    "hb-sling-brown":     "women-tote-bag-crossbody-sling-bag-fashi-3.jpg",
    "hb-crossbody":       "women-tote-bag-crossbody-sling-bag-fashi-1.jpg",
    "hb-oversized":       "women-tote-bag-crossbody-sling-bag-fashi-5.jpg",
    # Pickles
    "pk-lemon":           "indian-pickles-lemon-pickle-tomato-pickl-3.jpg",
    "pk-mango":           "homemade-indian-pickle-jar-mango-lemon-a-4.jpg",
    "pk-tomato":          "indian-pickles-lemon-pickle-tomato-pickl-1.jpg",
    "pk-veldt":           "homemade-indian-pickle-jar-mango-lemon-a-1.jpg",
    "pk-combo":           "homemade-indian-pickle-jar-mango-lemon-a-2.jpg",
    # Category / about reuse
    "cat-crochet":        "crochet-bunny-doll-elephant-amigurumi-ha-5.jpg",
    "cat-shopping-bags":  "eco-friendly-cotton-tote-bag-reusable-sh-4.jpg",
    "cat-handbags":       "women-leather-handbag-shoulder-bag-elega-4.png",
    "cat-pickles":        "indian-pickles-lemon-pickle-tomato-pickl-2.jpg",
    "about-craft":        "handmade-crochet-bag-yarn-5.jpg",
}

def decode_original(thumb_url: str):
    try:
        tail = thumb_url.rstrip("/").split("/")[-1]
        tail += "=" * (-len(tail) % 4)
        return base64.urlsafe_b64decode(tail).decode("utf-8", "ignore")
    except Exception:
        return None

def fetch(url: str, dest: str) -> bool:
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read(8_000_000)
        if len(data) < 4000:
            return False
        with open(dest, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print(f"   fetch failed ({type(e).__name__}): {url[:90]}")
        return False

def thumb_urls():
    """Read the brave thumbnail URLs from the earlier search results (hardcoded below)."""
    import json
    with open("site/thumb_urls.json") as f:
        return json.load(f)

def etsy_upsize(url: str):
    """Etsy CDN images can be requested in larger renditions."""
    import re
    for small in ("il_300x300", "il_340x270", "il_500x500"):
        if small in url:
            return url.replace(small, "il_794xN")
    return url

def process(pid, src_file, urls):
    out = f"{OUT}/{pid}.jpg"
    if os.path.exists(out):
        print(f"skip {pid}")
        return
    tmp = f"/tmp/zhop_{pid}_orig"
    got = False
    orig = decode_original(urls.get(src_file, ""))
    candidates = []
    if orig:
        up = etsy_upsize(orig)
        if up != orig:
            candidates.append(up)
        candidates.append(orig)
    for cand in candidates:
        if fetch(cand, tmp):
            got = True
            break
    if got:
        subprocess.run(["convert", tmp, "-resize", "900x900>", "-strip", "-quality", "82",
                        "-background", "white", "-alpha", "remove", "-alpha", "off", out], check=False)
        if os.path.exists(out) and os.path.getsize(out) > 3000:
            print(f"OK   {pid}  (original)")
            return
    # fallback: resize the local thumbnail
    src = os.path.join(SRC, src_file)
    subprocess.run(["convert", src, "-resize", "900x900>", "-strip", "-quality", "82",
                    "-background", "white", "-alpha", "remove", "-alpha", "off", out], check=False)
    print(f"OK   {pid}  (thumbnail fallback)")

if __name__ == "__main__":
    urls = thumb_urls()
    for pid, src_file in MAPPING.items():
        process(pid, src_file, urls)
    print("\n--- sizes ---")
    subprocess.run(f"identify -format '%f %wx%h %B bytes\\n' {OUT}/*.jpg | sort", shell=True)
