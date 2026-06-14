"""
產生 PWA 圖示 PNG（不需要 Pillow，只用 Python 標準庫）
執行：python create-icons.py
"""
import struct, zlib, os, math

def make_png(size):
    bg  = (77, 106, 85)      # #4D6A55 sage green
    fg  = (255, 255, 255)    # white
    rim = (245, 243, 239)    # #f5f3ef app background

    cx = cy = size / 2
    R  = size * 0.46         # outer circle
    sr = size * 0.20         # stem radius

    def in_circle(px, py, ox, oy, r):
        return (px - ox)**2 + (py - oy)**2 <= r**2

    def in_leaf(px, py):
        # Two lobes forming a yin-yang-style leaf
        lobe = R * 0.30
        d1 = in_circle(px, py, cx - lobe*0.55, cy - lobe*0.55, lobe * 1.15)
        d2 = in_circle(px, py, cx + lobe*0.55, cy + lobe*0.55, lobe * 1.15)
        stem = in_circle(px, py, cx, cy, sr * 0.38)
        return (d1 or d2) and not stem

    pixels = []
    for y in range(size):
        for x in range(size):
            if not in_circle(x, y, cx, cy, R):
                pixels.append(rim)
            elif in_leaf(x, y):
                pixels.append(fg)
            else:
                pixels.append(bg)

    rows = b''.join(
        b'\x00' + b''.join(bytes(pixels[r * size + c]) for c in range(size))
        for r in range(size)
    )

    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', zlib.compress(rows))
            + chunk(b'IEND', b''))

os.makedirs('icons', exist_ok=True)
for size in [180, 192, 512]:
    path = f'icons/icon-{size}.png'
    with open(path, 'wb') as f:
        f.write(make_png(size))
    print(f'OK: {path}')
