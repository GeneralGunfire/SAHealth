import sys, requests, io
url, out = sys.argv[1], sys.argv[2]
r = requests.get(url, headers={"User-Agent":"Mozilla/5.0 research"}, timeout=120)
print(r.status_code, len(r.content))
try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader
rd = PdfReader(io.BytesIO(r.content))
txt = "\n".join((p.extract_text() or "") for p in rd.pages)
open(out,"w",encoding="utf-8").write(txt)
print(len(rd.pages), len(txt))
