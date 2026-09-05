import struct, zlib

W, H = 1200, 630


def hex_to_rgb(h: str):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))


top = hex_to_rgb("#0a0a0a")
bot = hex_to_rgb("#f5f5f5")

raw = bytearray()
for y in range(H):
    raw.append(0)  # filter type
    t = y / (H - 1)
    r = int(top[0] * (1 - t) + bot[0] * t)
    g = int(top[1] * (1 - t) + bot[1] * t)
    b = int(top[2] * (1 - t) + bot[2] * t)
    for x in range(W):
        raw.extend([r, g, b])


def chunk(typ, data):
    return (
        struct.pack(">I", len(data))
        + typ
        + data
        + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF)
    )


sig = b"\x89PNG\r\n\x1a\n"
ihdr = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)
idat = zlib.compress(bytes(raw))
png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")

with open("public/og.png", "wb") as f:
    f.write(png)
print("wrote", len(png), "bytes")
