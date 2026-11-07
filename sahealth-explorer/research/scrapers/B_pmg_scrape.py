"""B_pmg_scrape.py: polite fetch of PMG committee-question pages; saves text and prints keyword hits."""
import sys, time, re, requests
from bs4 import BeautifulSoup
H={"User-Agent":"SAHealth-research/1.0 (contact: project)"}
def get(url):
    r=requests.get(url,headers=H,timeout=60); r.raise_for_status()
    s=BeautifulSoup(r.text,"html.parser")
    for t in s(["script","style","nav","footer"]): t.decompose()
    return re.sub(r"\n\s*\n+","\n",s.get_text("\n"))
if __name__=="__main__":
    out=sys.argv[1]; kws=sys.argv[2].split("|")
    for u in sys.argv[3:]:
        try:
            t=get(u); n=u.rstrip("/").split("/")[-1]
            open(f"{out}/pmg_{n}.txt","w",encoding="utf-8").write(t)
            print("==",u,len(t))
            for i,l in enumerate(t.split("\n")):
                if any(k.lower() in l.lower() for k in kws): print("  ",l.strip()[:300])
        except Exception as e: print("ERR",u,e)
        time.sleep(3)
