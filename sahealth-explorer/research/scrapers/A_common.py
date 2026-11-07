"""Shared helpers for phase A scrapers: polite GET with delay, text extraction, keyword windows."""
import os, re, time, requests
from bs4 import BeautifulSoup
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
os.makedirs(OUT, exist_ok=True)
HDR = {"User-Agent": "Mozilla/5.0 (research; DEXA SAHealth phase A)"}
def get(url, delay=2.0, binary=False):
    time.sleep(delay)
    r = requests.get(url, headers=HDR, timeout=60)
    r.raise_for_status()
    return r.content if binary else r.text
def page_text(url, delay=2.0):
    soup = BeautifulSoup(get(url, delay), "html.parser")
    for t in soup(["script", "style", "nav", "footer"]):
        t.decompose()
    return re.sub(r"\n\s*\n+", "\n", soup.get_text("\n"))
def windows(text, pattern, width=300):
    out = []
    for m in re.finditer(pattern, text, flags=re.I):
        s, e = max(0, m.start()-width), min(len(text), m.end()+width)
        out.append(text[s:e].replace("\n", " "))
    return out
def save(name, content):
    p = os.path.join(OUT, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    return p
