"""Fetch PMG committee-meeting / committee-question pages and extract HPRS keyword windows."""
import sys
from A_common import page_text, windows, save
PAGES = {
 "meeting_40947": "https://pmg.org.za/committee-meeting/40947/",
 "meeting_41014": "https://pmg.org.za/committee-meeting/41014/",
 "meeting_41085": "https://pmg.org.za/committee-meeting/41085/",
 "NW2575": "https://pmg.org.za/committee-question/23475/",
 "NW3319": "https://pmg.org.za/committee-question/23923/",
 "NW4495": "https://pmg.org.za/committee-question/31734/",
 "NW4628": "https://pmg.org.za/committee-question/31749/",
}
PAT = r"HPRS|HPRN|Patient Registration|biometric|duplicate|synchron|offline"
for k, u in PAGES.items():
    try:
        t = page_text(u)
        w = windows(t, PAT, 250)
        print(k, len(t), "chars", len(w), "hits")
        save(f"A_pmg_{k}.txt", "\n---\n".join(w))
    except Exception as e:
        print(k, "ERR", e)
