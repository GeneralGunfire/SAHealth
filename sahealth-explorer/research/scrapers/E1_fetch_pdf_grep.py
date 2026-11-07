"""E1: download a PDF and grep text for keywords. Usage: python E1_fetch_pdf_grep.py URL kw1,kw2 """
import sys; sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import sys, io, re, requests
url, kws = sys.argv[1], [k.lower() for k in sys.argv[2].split(',')]
r = requests.get(url, timeout=60, headers={'User-Agent': 'Mozilla/5.0'})
print('status', r.status_code, len(r.content))
try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader
rd = PdfReader(io.BytesIO(r.content))
print('pages', len(rd.pages))
for i, p in enumerate(rd.pages):
    t = (p.extract_text() or '').replace('\n', ' ')
    for k in kws:
        for m in re.finditer(re.escape(k), t.lower()):
            s = max(0, m.start()-200); print(f'[p{i+1}] {k}: ...{t[s:m.end()+300]}...\n')
