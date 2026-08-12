#!/usr/bin/env python3
"""Regenerate the ItsZhop logo assets from the supplied master file.

Reads  assets/img/brand/logo.png  (the artwork exactly as supplied)
Writes mark-96/192/512.png    square monogram mark (header/footer/favicon)
       lockup-512.jpg         full logo incl. wordmark (social preview)

Only crops and scales — no recolouring, no redrawing, no masking.

    pip install pillow
    python3 tools/make_logo_assets.py

If you replace logo.png with a differently-composed file, re-measure the two
crop boxes below (draw them on the image and eyeball it) before running.

Requires: pillow
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")

BRAND = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img', 'brand')
MASTER = os.path.join(BRAND, 'logo.png')

# Crop boxes measured against the 1254x1254 master, as (left, top, right, bottom).
MONO = (270, 135, 910, 780)    # jute bag + blue IZ monogram
FULL = (200, 135, 1085, 1080)  # whole lockup incl. "ItsZhop" + tagline

MARK_SIZES = (96, 192)     # max render is 46px, so 192 covers 4x DPR
LOCKUP_W = 512             # og:image, JPEG (photographic artwork)
FILL_RATIO = 0.92              # how much of the square frame the mark fills


def square_pad(img, out_px, fill=FILL_RATIO):
    """Centre `img` on a square canvas, padded with its own border colour."""
    w, h = img.size
    canvas_px = int(round(max(w, h) / fill))

    # Backdrop colour = median of the crop's own edge pixels, so the padding
    # continues the leather texture's tone instead of introducing a new colour.
    px = img.load()
    edge = []
    for x in range(0, w, 3):
        edge.append(px[x, 0])
        edge.append(px[x, h - 1])
    for y in range(0, h, 3):
        edge.append(px[0, y])
        edge.append(px[w - 1, y])
    edge.sort(key=sum)
    bg = edge[len(edge) // 2]

    base = Image.new('RGB', (canvas_px, canvas_px), bg)
    base.paste(img, ((canvas_px - w) // 2, (canvas_px - h) // 2))
    return base.resize((out_px, out_px), Image.LANCZOS)


def main():
    if not os.path.exists(MASTER):
        sys.exit(f"missing master file: {MASTER}")

    src = Image.open(MASTER).convert('RGB')
    print(f"master: {src.size[0]}x{src.size[1]}")

    mono, full = src.crop(MONO), src.crop(FULL)

    for px in MARK_SIZES:
        square_pad(mono, px).save(os.path.join(BRAND, f'mark-{px}.png'), optimize=True)

    ratio = full.height / full.width
    full.resize((LOCKUP_W, int(round(LOCKUP_W * ratio))), Image.LANCZOS) \
        .save(os.path.join(BRAND, 'lockup-512.jpg'), quality=88, optimize=True)

    for name in sorted(os.listdir(BRAND)):
        if name.startswith(('mark-', 'lockup-')):
            path = os.path.join(BRAND, name)
            w, h = Image.open(path).size
            print(f"  {name:20s} {w}x{h:<6} {os.path.getsize(path) / 1024:7.1f} KB")


if __name__ == '__main__':
    main()
