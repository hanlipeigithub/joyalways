"""从巨潮资讯网抓取洁雅股份(301108)公告 -> src/data/cninfo.json"""
import json, time, urllib.request, urllib.parse, datetime, sys

API = "http://www.cninfo.com.cn/new/hisAnnouncement/query"
STATIC = "http://static.cninfo.com.cn/"
HDRS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": "http://www.cninfo.com.cn/new/disclosure/stock?orgId=9900041541&stockCode=301108",
}

def query(category="", page_size=30, page=1):
    data = urllib.parse.urlencode({
        "pageNum": page, "pageSize": page_size, "column": "szse", "tabName": "fulltext",
        "plate": "sz", "stock": "301108,9900041541", "searchkey": "", "secid": "",
        "category": category, "trade": "", "seDate": "",
    }).encode()
    req = urllib.request.Request(API, data=data, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def norm(a):
    ts = a.get("announcementTime") or 0
    date = datetime.datetime.fromtimestamp(ts / 1000).strftime("%Y-%m-%d") if ts else ""
    title = (a.get("announcementTitle") or "").replace("<em>", "").replace("</em>", "")
    return {
        "id": str(a.get("announcementId") or ""),
        "title": title,
        "date": date,
        "pdf": STATIC + (a.get("adjunctUrl") or ""),
        "sizeKB": a.get("adjunctSize") or 0,
    }

out = {"source": "巨潮资讯网 cninfo.com.cn", "stock": "301108", "fetchedAt": datetime.datetime.now().isoformat(timespec="seconds"), "periodic": [], "latest": []}

# 定期报告:年度/半年度/季度
cats = {"category_ndbg_szsh": "年度报告", "category_bndbg_szsh": "半年度报告",
        "category_yjdbg_szsh": "一季度报告", "category_sjdbg_szsh": "三季度报告"}
seen = set()
for cat, label in cats.items():
    try:
        r = query(cat, page_size=8)
        for a in r.get("announcements") or []:
            n = norm(a)
            if n["id"] and n["id"] not in seen and "摘要" not in n["title"] and "取消" not in n["title"]:
                n["kind"] = label
                out["periodic"].append(n); seen.add(n["id"])
        time.sleep(1)
    except Exception as e:
        print(f"WARN {cat}: {e}", file=sys.stderr)

# 最新公告
try:
    r = query("", page_size=30)
    for a in r.get("announcements") or []:
        n = norm(a)
        if n["id"]:
            out["latest"].append(n)
except Exception as e:
    print(f"WARN latest: {e}", file=sys.stderr)

out["periodic"].sort(key=lambda x: x["date"], reverse=True)
json.dump(out, open("src/data/cninfo.json", "w"), ensure_ascii=False, indent=2)
print(f"periodic={len(out['periodic'])} latest={len(out['latest'])}")
