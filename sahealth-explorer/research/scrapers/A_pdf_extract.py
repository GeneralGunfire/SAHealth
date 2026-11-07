"""Download a PDF and dump its text (pypdf) plus keyword windows. Usage: A_pdf_extract.py URL NAME PATTERN"""
import io, sys
from pypdf import PdfReader
from A_common import get, windows, save
url, name, pat = sys.argv[1], sys.argv[2], sys.argv[3]
data = get(url, binary=True)
rd = PdfReader(io.BytesIO(data))
txt = "\n".join((p.extract_text() or "") for p in rd.pages)
save(f"A_{name}_full.txt", txt)
w = windows(txt, pat, 300)
save(f"A_{name}_hits.txt", "\n---\n".join(w))
print(name, len(rd.pages), "pages", len(txt), "chars", len(w), "hits")
