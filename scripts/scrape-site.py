"""
抓取 www.joyalways.com 真实内容到本项目的离线数据与素材。

产出：
- public/assets/site/...        原站图片/PDF（按原路径分层）
- src/data/news.json            新闻（详情页抓取）
- src/data/notices.json         公告（PDF 列表）
- src/data/products.json        产品（干湿巾/美容洗护两大分类）
- src/data/pages.json           各栏目页正文（清洗后 HTML）
- src/data/media.json           图片清单（按用途分类）
- scripts/scrape-failures.json  失败清单

约束：新闻/公告 ≤40 条，图片 ≤150 张（去重，单张 >5MB 跳过）。
"""
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import urllib.request
from bs4 import BeautifulSoup

BASE = "https://www.joyalways.com/"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "public" / "assets" / "site"
DATA_DIR = ROOT / "src" / "data"
FAIL_FILE = ROOT / "scripts" / "scrape-failures.json"

MAX_NEWS = 40
MAX_NOTICES = 40
MAX_IMAGES = 150
MAX_BYTES = 5 * 1024 * 1024

failures: list[dict] = []
downloaded: dict[str, str] = {}  # url -> local web path


def fetch(url: str, binary: bool = False, timeout: int = 25):
    """带 UA / 超时 / 1 次重试的抓取。失败返回 None 并记录。"""
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = resp.read()
                if binary:
                    return data
                # 原站为 utf-8
                return data.decode("utf-8", errors="ignore")
        except Exception as e:  # noqa: BLE001
            if attempt == 1:
                failures.append({"url": url, "error": f"{type(e).__name__}: {e}"})
                return None
            time.sleep(1.5)
    return None


def local_path_for(url: str) -> str:
    """把原站资源 URL 映射为本地 web 路径 /assets/site/<path>"""
    p = urlparse(url)
    path = p.path.lstrip("/")
    # 清理文件名中的括号等特殊字符，避免构建/服务问题
    parts = [re.sub(r"[()\s]+", "_", seg) for seg in path.split("/")]
    return "/assets/site/" + "/".join(parts)


def normalize_url(url: str) -> str:
    """旧域名 babywipes.com.cn 的图片在 joyalways.com 同路径下可用，统一重写。"""
    url = urljoin(BASE, url)
    p = urlparse(url)
    if "babywipes.com.cn" in p.netloc:
        url = f"https://www.joyalways.com{p.path}"
        if p.query:
            url += f"?{p.query}"
    return url


def download_asset(url: str, referer: str = "") -> str | None:
    """下载图片/PDF 到 public/assets/site，返回本地路径。超限/失败返回 None。"""
    url = normalize_url(url)
    if url in downloaded:
        return downloaded[url]
    if len(downloaded) >= MAX_IMAGES:
        failures.append({"url": url, "error": "skipped: image quota reached"})
        return None
    web = local_path_for(url)
    dest = ROOT / "public" / web.lstrip("/")
    if dest.exists() and dest.stat().st_size > 0:
        downloaded[url] = web
        return web
    data = fetch(url, binary=True)
    if data is None:
        return None
    if len(data) > MAX_BYTES:
        failures.append({"url": url, "error": f"skipped: {len(data)//1024}KB > 5MB"})
        return None
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    downloaded[url] = web
    print(f"  [img] {web} ({len(data)//1024}KB)")
    return web


EVENT_ATTR = re.compile(r"^on", re.I)


def clean_html(node, page_url: str) -> str:
    """清洗正文节点：去脚本/事件/样式属性，重写图片为本地路径，外链新窗口。"""
    if node is None:
        return ""
    soup = BeautifulSoup(str(node), "html.parser")
    for tag in soup.find_all(["script", "iframe", "style", "link", "noscript", "svg", "form", "input", "button", "select", "textarea"]):
        tag.decompose()
    for tag in soup.find_all(True):
        # 删除事件/样式/class/uk-* 属性
        for attr in list(tag.attrs):
            if EVENT_ATTR.match(attr) or attr in ("style", "class", "id") or attr.startswith("uk-") or attr.startswith("data-"):
                del tag.attrs[attr]
        if tag.name == "img":
            src = tag.get("src")
            if src:
                abs_src = urljoin(page_url, src)
                local = download_asset(abs_src)
                if local:
                    tag["src"] = local
                else:
                    tag.decompose()
                    continue
            tag["loading"] = "lazy"
            if not tag.get("alt"):
                tag["alt"] = ""
        elif tag.name == "a":
            href = tag.get("href")
            if href:
                if href.startswith("javascript"):
                    tag.unwrap()
                    continue
                if href.startswith("#"):
                    del tag["href"]
                else:
                    tag["href"] = urljoin(page_url, href)
                    tag["target"] = "_blank"
                    tag["rel"] = "noopener noreferrer"
    # 展开 div/span/figure/figcaption，保留语义块级结构
    for tag in soup.find_all(["div", "span", "figure", "figcaption", "section", "article", "font", "center", "i"]):
        tag.unwrap()
    # 删除空标签
    for tag in soup.find_all(True):
        if tag.name not in ("img", "br", "hr", "td", "th") and not tag.get_text(strip=True) and not tag.find("img"):
            tag.decompose()
    return str(soup).strip()


def text_of(node) -> str:
    return re.sub(r"\s+", " ", node.get_text(" ", strip=True)) if node else ""


def norm_date(raw: str) -> str:
    m = re.search(r"(20\d\d)[-年./](\d{1,2})[-月./](\d{1,2})", raw)
    if not m:
        return ""
    return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"


# ---------------------------------------------------------------- news

def scrape_news() -> list[dict]:
    print("== news list ==")
    html = fetch(urljoin(BASE, "news.php"))
    if html is None:
        return []
    soup = BeautifulSoup(html, "html.parser")
    ids: list[str] = []
    cover_map: dict[str, str] = {}
    for li in soup.select("ul.hot_news_img li"):
        a = li.find("a", href=re.compile(r"news\.php\?p=(\d+)"))
        img = li.find("img")
        if a:
            nid = re.search(r"p=(\d+)", a["href"]).group(1)
            if nid not in ids:
                ids.append(nid)
            if img and img.get("src"):
                cover_map[nid] = img["src"]
    for a in soup.find_all("a", href=re.compile(r"news\.php\?p=(\d+)")):
        nid = re.search(r"p=(\d+)", a["href"]).group(1)
        if nid not in ids:
            ids.append(nid)
    ids = ids[:MAX_NEWS]
    print(f"  {len(ids)} news ids: {ids}")

    items = []
    for nid in ids:
        url = urljoin(BASE, f"news.php?p={nid}")
        print(f"== news detail {nid} ==")
        html = fetch(url)
        if html is None:
            continue
        soup = BeautifulSoup(html, "html.parser")
        h1 = soup.find("h1")
        title = text_of(h1) or (soup.title.string.strip() if soup.title else f"新闻 {nid}")
        date = norm_date(text_of(soup.select_one(".news_date")) or "")
        content_node = soup.select_one(".news_content")
        body = clean_html(content_node, url) if content_node else ""
        if not body and content_node is None:
            # 降级：保留原始正文文本
            body = f"<p>{text_of(soup.body)}</p>"
        # 摘要：正文纯文本前 120 字
        plain = text_of(BeautifulSoup(body, "html.parser"))
        summary = plain[:120] + ("…" if len(plain) > 120 else "")
        # 封面：列表页映射 > 正文首图
        cover = ""
        if nid in cover_map:
            cover = download_asset(cover_map[nid]) or ""
        if not cover:
            first_img = BeautifulSoup(body, "html.parser").find("img")
            if first_img:
                cover = first_img.get("src", "")
        items.append({
            "id": nid,
            "title": title,
            "date": date,
            "summary": summary,
            "bodyHtml": body,
            "cover": cover,
        })
    return items


# ---------------------------------------------------------------- notices

def scrape_notices() -> list[dict]:
    print("== notices ==")
    html = fetch(urljoin(BASE, "notice.php"))
    if html is None:
        return []
    soup = BeautifulSoup(html, "html.parser")
    items = []
    seen = set()
    for a in soup.find_all("a", href=re.compile(r"\.pdf", re.I)):
        href = urljoin(BASE, a["href"])
        if href in seen:
            continue
        seen.add(href)
        title = text_of(a) or Path(urlparse(href).path).stem
        local_pdf = download_asset(href)
        items.append({
            "id": f"notice-{len(items)+1:03d}",
            "title": title,
            "date": "",
            "summary": "公示公告文件（PDF）",
            "bodyHtml": "",
            "pdf": local_pdf or href,
            "cover": "",
        })
        if len(items) >= MAX_NOTICES:
            break
    print(f"  {len(items)} notices")
    return items


# ---------------------------------------------------------------- products

def parse_product_page(url: str, category: str) -> list[dict]:
    html = fetch(url)
    if html is None:
        return []
    soup = BeautifulSoup(html, "html.parser")
    grid = soup.select_one(".product_list_20220822 .uk-grid-large")
    if grid is None:
        grid = soup.select_one(".uk-grid-large")
    items = []
    if grid:
        for cell in grid.find_all("div", recursive=False):
            h4 = cell.find("h4")
            if not h4:
                continue
            title = text_of(h4)
            img = cell.select_one(".product_thumb img")
            desc = text_of(cell.select_one(".tf_subtitle"))
            cats = text_of(cell.select_one("figcaption"))
            cats = re.sub(r"^产品类目\s*", "", cats)
            cover = download_asset(img["src"]) if img and img.get("src") else ""
            pid = f"{category}-{len(items)+1:02d}"
            body_parts = []
            if desc:
                body_parts.append(f"<p>{desc}</p>")
            if cats:
                body_parts.append(f"<p><strong>产品类目：</strong>{cats}</p>")
            if cover:
                body_parts.append(f'<p><img src="{cover}" alt="{title}" loading="lazy"/></p>')
            items.append({
                "id": pid,
                "category": category,
                "title": title,
                "desc": desc,
                "categories": cats,
                "cover": cover or "",
                "bodyHtml": "".join(body_parts),
            })
    print(f"  {category}: {len(items)} items")
    return items


def scrape_products() -> dict:
    print("== products ==")
    wipes = parse_product_page(urljoin(BASE, "product.php"), "wipes")
    beauty = parse_product_page(urljoin(BASE, "product_beauty_care.php"), "beauty")
    return {
        "categories": [
            {"key": "wipes", "name": "干湿巾类", "en": "WET & DRY WIPES"},
            {"key": "beauty", "name": "美容洗护类", "en": "BEAUTY & CARE"},
        ],
        "items": wipes + beauty,
    }


# ---------------------------------------------------------------- pages

PAGE_SECTIONS = {
    "about": ["about_sec01", "sec_history", "sec_culture", "sec_honor", "sec_duty"],
    "research": ["yanfa_wrap", "core_service", "one_step", "huanjing", "research"],
    "manufacturing": ["shuixitong", "inquipment"],
    "quality": ["zhiliang_container", "zhiliang_grid_wrap"],
    "muslim": ["qingzhen_container"],
    "cooperation": ["cooperation_hero"],
    "invest": ["invest_container"],
    "contact": ["contact_hero"],
    "jobs": ["jobs_container", "sec_fuli"],
}

PAGE_URLS = {k: f"{k}.php" for k in PAGE_SECTIONS}


def scrape_pages() -> dict:
    pages = {}
    for key, sections in PAGE_SECTIONS.items():
        url = urljoin(BASE, PAGE_URLS[key])
        print(f"== page {key} ==")
        html = fetch(url)
        if html is None:
            continue
        soup = BeautifulSoup(html, "html.parser")
        blocks = []
        for cls in sections:
            node = soup.find(["section", "div"], class_=cls)
            if node is None:
                failures.append({"url": url, "error": f"section .{cls} not found"})
                continue
            cleaned = clean_html(node, url)
            if cleaned:
                blocks.append({"key": cls, "html": cleaned})
        plain = text_of(soup.body)
        pages[key] = {"blocks": blocks, "plainText": plain[:3000]}
    return pages


# ---------------------------------------------------------------- contact info

def scrape_contact_info() -> dict:
    html = fetch(urljoin(BASE, "contact.php")) or ""
    text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True) if html else ""
    info = {"address": "", "hotlines": [], "emails": [], "fax": ""}
    m = re.search(r"(?:公司)?地址[：:]\s*([^\s<'\\]{4,60}号)", text)
    if not m:
        # 地址也可能藏在 JS 字符串里（高德地图 infoWindow）
        m = re.search(r"(?:公司)?地址[：:]\s*([^\s<'\\]{4,60}号)", html)
    if m:
        info["address"] = m.group(1)
    info["hotlines"] = sorted(set(re.findall(r"(?:外销|内销|人力资源)?热线[：:]\s*([0-9-]{7,15})", text)))
    info["emails"] = sorted(set(re.findall(r"邮箱[：:]\s*([A-Za-z0-9@._-]+)", text)))
    notice_html = fetch(urljoin(BASE, "notice.php")) or ""
    ntext = BeautifulSoup(notice_html, "html.parser").get_text(" ", strip=True)
    mf = re.search(r"传真[：:]\s*([0-9-]+)", ntext)
    if mf:
        info["fax"] = mf.group(1)
    print("  contact:", info)
    return info


# ---------------------------------------------------------------- home media

def scrape_home_media() -> dict:
    """首页素材：banner、合作伙伴、事业版图、厂区全景等。"""
    print("== home media ==")
    html = fetch(BASE)
    media = {"banners": [], "bannerTexts": [], "partners": [], "map": "", "panorama": [], "misc": []}
    if html is None:
        return media
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src") or ""
        if not src:
            continue
        abs_src = urljoin(BASE, src)
        name = Path(urlparse(abs_src).path).name.lower()
        if "logo" in name or "svg" in name or "icon" in name or "police" in name:
            continue
        if re.match(r"banner\d\.(jpg|png)", name):
            local = download_asset(abs_src)
            if local:
                media["banners"].append(local)
        elif re.match(r"banner\d_text\.png", name):
            local = download_asset(abs_src)
            if local:
                media["bannerTexts"].append(local)
        elif name == "business_map.png":
            local = download_asset(abs_src)
            if local:
                media["map"] = local
        elif re.match(r"c\d+\.(png|jpg)", name):
            local = download_asset(abs_src)
            if local:
                media["partners"].append(local)
        elif name in ("99.jpg", "qqq.jpg") or "uploads/image/index/" in abs_src:
            local = download_asset(abs_src)
            if local:
                media["panorama"].append(local)
    # 去重
    for k in media:
        if isinstance(media[k], list):
            media[k] = sorted(set(media[k]))
    print("  media:", {k: (len(v) if isinstance(v, list) else v) for k, v in media.items()})
    return media


def scrape_manufacturing_media() -> list[str]:
    """制造能力页面的实拍图（含 inline style 背景图 mc01-06 等）。"""
    print("== manufacturing media ==")
    html = fetch(urljoin(BASE, "manufacturing.php"))
    out = []
    if html is None:
        return out
    soup = BeautifulSoup(html, "html.parser")
    urls = set()
    for img in soup.find_all("img"):
        if img.get("src"):
            urls.add(urljoin(BASE, img["src"]))
    # inline style 背景图 + HTML 注释中的图片 URL
    for m in re.findall(r"url\((['\"]?)(https?://[^)'\"]+)\1\)", html):
        urls.add(m[1])
    for m in re.findall(r"https?://[^'\")\s<>]*uploads/image/[^'\")\s<>]*\.(?:jpg|jpeg|png|gif)", html, re.I):
        urls.add(m)
    for u in sorted(urls):
        if "uploads/image/" in u and "police" not in u:
            local = download_asset(u)
            if local and local not in out:
                out.append(local)
    print(f"  {len(out)} manufacturing images")
    return out


def main():
    SITE_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    news = scrape_news()
    notices = scrape_notices()
    products = scrape_products()
    pages = scrape_pages()
    contact = scrape_contact_info()
    home_media = scrape_home_media()
    mfg_media = scrape_manufacturing_media()

    media = home_media
    media["manufacturing"] = mfg_media

    (DATA_DIR / "news.json").write_text(json.dumps(news, ensure_ascii=False, indent=2), "utf-8")
    (DATA_DIR / "notices.json").write_text(json.dumps(notices, ensure_ascii=False, indent=2), "utf-8")
    (DATA_DIR / "products.json").write_text(json.dumps(products, ensure_ascii=False, indent=2), "utf-8")
    pages["_contact"] = contact
    (DATA_DIR / "pages.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2), "utf-8")
    (DATA_DIR / "media.json").write_text(json.dumps(media, ensure_ascii=False, indent=2), "utf-8")
    FAIL_FILE.write_text(json.dumps(failures, ensure_ascii=False, indent=2), "utf-8")

    print("\n==== SUMMARY ====")
    print(f"news: {len(news)}, notices: {len(notices)}, products: {len(products['items'])}, pages: {len(pages)-1}")
    print(f"assets downloaded: {len(downloaded)}")
    print(f"failures: {len(failures)} -> {FAIL_FILE}")


if __name__ == "__main__":
    main()
