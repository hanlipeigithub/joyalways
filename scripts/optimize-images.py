"""一次性图片预处理：裁掉底部约 45px（去「AI生成」水印），转 JPEG quality=85，删除原 PNG。"""
from pathlib import Path

from PIL import Image

IMG_DIR = Path(__file__).resolve().parent.parent / "public" / "images"

CROP_BOTTOM = 45
QUALITY = 85

for png in sorted(IMG_DIR.glob("*.png")):
    im = Image.open(png).convert("RGB")
    w, h = im.size
    im = im.crop((0, 0, w, h - CROP_BOTTOM))
    out = png.with_suffix(".jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"{png.name}: {w}x{h} -> {im.size[0]}x{im.size[1]}, "
          f"{png.stat().st_size // 1024}KB -> {out.stat().st_size // 1024}KB")
    png.unlink()

print("done")
