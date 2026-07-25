"""压缩 public/assets/site 下的抓取素材：
- JPG：限制最大边 1600（banner 1920），quality=80 渐进式
- 无透明通道的 PNG：转 JPG（同路径换扩展名），并回写 src/data/*.json 中的引用
- 有透明的 PNG：仅缩放+优化（logo/文字层）
- 跳过 200KB 以下的小文件与 PDF
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "public" / "assets" / "site"
DATA = ROOT / "src" / "data"

path_map: dict[str, str] = {}  # /assets/site/...png -> .jpg
saved_bytes = 0


def max_side_for(p: Path) -> int:
    name = p.name.lower()
    if "banner" in name:
        return 1920
    if "business_map" in name:
        return 1800
    return 1600


for f in sorted(SITE.rglob("*")):
    if f.suffix.lower() not in (".jpg", ".jpeg", ".png"):
        continue
    size = f.stat().st_size
    if size < 200 * 1024:
        continue
    try:
        im = Image.open(f)
    except Exception as e:  # noqa: BLE001
        print("skip unreadable", f, e)
        continue
    old = size
    side = max_side_for(f)
    if max(im.size) > side:
        im.thumbnail((side, side), Image.LANCZOS)

    is_png = f.suffix.lower() == ".png"
    keep_alpha_names = ("business_map", "banner1_text", "banner2_text", "banner3_text", "c03", "c07", "c10", "water_drop")
    keep_alpha = any(k in f.name.lower() for k in keep_alpha_names)
    if is_png:
        alpha = im.getchannel("A") if "A" in im.getbands() else None
        # 大 PNG 即使带少量透明也合成白底转 JPG（证书/实拍类均展示在浅色背景上）
        force_flatten = size > 400 * 1024 and not keep_alpha
        opaque = alpha is None or alpha.getextrema()[0] == 255 or force_flatten
    else:
        opaque = False
    if is_png and opaque:
        # 透明通道无实际内容（或强制白底）→ 转 JPG
        out = f.with_suffix(".jpg")
        if "A" in im.getbands():
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.getchannel("A"))
            im = bg
        im.convert("RGB").save(out, "JPEG", quality=80, optimize=True, progressive=True)
        if out.stat().st_size < old:
            f.unlink()
            web_old = "/" + f.relative_to(ROOT / "public").as_posix()
            web_new = "/" + out.relative_to(ROOT / "public").as_posix()
            path_map[web_old] = web_new
            saved_bytes += old - out.stat().st_size
            print(f"png->jpg {f.name}: {old//1024}KB -> {out.stat().st_size//1024}KB")
            continue
        out.unlink()
    fmt = "JPEG" if f.suffix.lower() in (".jpg", ".jpeg") else "PNG"
    kwargs = {"optimize": True}
    if fmt == "JPEG":
        kwargs.update(quality=80, progressive=True)
    im.save(f, fmt, **kwargs)
    new = f.stat().st_size
    saved_bytes += max(0, old - new)
    if new < old:
        print(f"compress {f.name}: {old//1024}KB -> {new//1024}KB")

# 回写 JSON 引用
for jf in DATA.glob("*.json"):
    text = jf.read_text("utf-8")
    for old, new in path_map.items():
        text = text.replace(old, new)
    jf.write_text(text, "utf-8")

print(f"\npath rewrites: {len(path_map)}, saved ~{saved_bytes//1024//1024}MB")
