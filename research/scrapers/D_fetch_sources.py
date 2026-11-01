"""Phase D (private sector / claims) source fetcher.
Polite fetcher: 2 s delay, identifies itself, saves text to the scratchpad-style output dir.
Usage: python -I D_fetch_sources.py out_dir
"""
import sys, time, pathlib, requests
from bs4 import BeautifulSoup

URLS = [
    "https://healthtech.altron.com/switchon",
    "https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect",
    "https://www.nutanix.com/en_gb/company/customers/healthbridge",
    "https://cioafrica.co/mediclinic-selects-hcr-for-connected-health-as-foundation-for-its-epr/",
    "https://techcentral.co.za/medscheme-to-roll-out-electronic-records/192973",
    "https://marketplace.fico.com/blogs/digital-transformation-inside-medscheme-s-decision-platform",
    "https://netcare.co.za/NewsHub/Articles/pioneering-electronic-medical-record-system-a-game-changer-for-hospital",
]

def main(out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    s = requests.Session(); s.headers["User-Agent"] = "SAHealth-research/1.0 (DEXA)"
    for i, u in enumerate(URLS):
        try:
            r = s.get(u, timeout=30)
            text = BeautifulSoup(r.text, "html.parser").get_text("\n", strip=True)
            (out / f"D_{i:02d}.txt").write_text(u + "\n\n" + text, encoding="utf-8")
        except Exception as e:
            print("fail", u, e)
        time.sleep(2)

if __name__ == "__main__":
    main(sys.argv[1])
