"""Shared helpers for E2_ scrapers: fetch a URL, strip to text, return keyword-context hits."""
import re, sys, requests
from bs4 import BeautifulSoup
UA = {"User-Agent": "Mozilla/5.0 (research; SAHealth DEXA)"}
def fetch_text(url, timeout=40):
    r = requests.get(url, headers=UA, timeout=timeout)
    r.raise_for_status()
    soup = BeautifulSoup(r.content, "html.parser")
    for t in soup(["script", "style", "nav", "footer"]):
        t.decompose()
    title = soup.title.get_text(strip=True) if soup.title else ""
    text = re.sub(r"\s+", " ", soup.get_text(" ", strip=True))
    return title, text
def hits(text, kws, width=220, maxn=6):
    out = []
    for k in kws:
        for m in list(re.finditer(re.escape(k), text, re.I))[:maxn]:
            s = max(0, m.start() - width); e = min(len(text), m.end() + width)
            out.append((k, text[s:e]))
    return out
def run(urls, kws):
    for u in urls:
        try:
            t, x = fetch_text(u)
            print("==", u, "|", t, "| chars", len(x))
            for k, h in hits(x, kws):
                print("  [%s] %s" % (k, h))
        except Exception as ex:
            print("==", u, "FAILED", ex)
