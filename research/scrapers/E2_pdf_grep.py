"""E2: download a PDF (requests), extract text with PyMuPDF, print keyword contexts.
usage: python E2_pdf_grep.py URL kw1 kw2 ..."""
import sys, io, re, requests, fitz
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
UA = {"User-Agent": "Mozilla/5.0 (research; SAHealth DEXA)"}
def main(url, kws, width=250, maxn=4):
    r = requests.get(url, headers=UA, timeout=120); r.raise_for_status()
    doc = fitz.open(stream=r.content, filetype="pdf")
    text = " ".join(p.get_text() for p in doc)
    text = re.sub(r"\s+", " ", text)
    print("PDF", url, "pages", len(doc), "chars", len(text))
    for k in kws:
        ms = list(re.finditer(re.escape(k), text, re.I))
        print("--", k, "matches", len(ms))
        for m in ms[:maxn]:
            print("   ...", text[max(0, m.start()-width): m.end()+width])
if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
