"""B_fetch_pdf.py: download a PDF politely and dump text with pypdf. usage: url out.txt"""
import sys, requests
from pypdf import PdfReader
import io
r=requests.get(sys.argv[1],headers={"User-Agent":"SAHealth-research/1.0"},timeout=120); r.raise_for_status()
rd=PdfReader(io.BytesIO(r.content))
open(sys.argv[2],"w",encoding="utf-8").write("\n".join(f"--- page {i+1} ---\n"+(p.extract_text() or "") for i,p in enumerate(rd.pages)))
print(len(rd.pages),"pages")
