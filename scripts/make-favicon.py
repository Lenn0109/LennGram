import struct, zlib

W, H = 32, 32
top = (0x0A, 0x0A, 0x0A)

raw = bytearray()
for y in range(H):
    raw.append(0)
    for x in range(W):
        raw.extend(top)


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

with open("public/favicon.png", "wb") as f:
    f.write(png)
print("wrote favicon")
