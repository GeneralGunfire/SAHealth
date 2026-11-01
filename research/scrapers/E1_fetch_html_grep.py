"""E1: fetch HTML page with requests+BeautifulSoup and grep text for keywords."""
import sys; sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import sys, re, requests
from bs4 import BeautifulSoup
url, kws = sys.argv[1], [k.lower() for k in sys.argv[2].split(',')]
r = requests.get(url, timeout=60, headers={'User-Agent': 'Mozilla/5.0'})
print('status', r.status_code)
t = BeautifulSoup(r.text, 'html.parser').get_text(' ', strip=True)
for k in kws:
    for m in re.finditer(re.escape(k), t.lower()):
        s = max(0, m.start()-200); print(f'{k}: ...{t[s:m.end()+300]}...\n')
