"""E2: fetch assorted pages (CHW/mHealth/poison/cancer/PEPFAR) and print keyword contexts."""
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from E2_common import run
URLS = ["https://pmc.ncbi.nlm.nih.gov/articles/PMC5922483",
        "https://www.reachdigitalhealth.org/resources/contact-ndoh",
        "https://www.exemplars.health/emerging-topics/epidemic-preparedness-and-response/digital-health-tools/healthconnect-in-south-africa",
        "https://health.uct.ac.za/media/159314",
        "https://www.nioh.ac.za/?p=535",
        "https://saprin.samrc.ac.za/promise.html",
        "https://www.wits.ac.za/news/latest-news/general-news/2020/2020-07/gauteng-universities-consortium-launch-urban-research-nodes-to-inform-response-to-covid-19-hotspots-.html",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9082220"]
run(URLS, ["million", "users", "OpenHIM", "TeleLog", "AfriTox", "calls", "surveillance", "referrals", "REDCap", "nodes"])
