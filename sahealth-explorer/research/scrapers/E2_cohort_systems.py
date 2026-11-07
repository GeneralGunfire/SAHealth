"""E2: fetch HDSS / registry / CHW pages and print keyword contexts."""
from E2_common import run
URLS = ["https://data.ahri.org/index.php/catalog/1206",
        "https://www.nioh.ac.za/legislation-ushers-south-africa-into-a-new-era-for-cancer-registration/",
        "https://dimagi.com/blog/ndoh-national-scale-mhealth-south-africa/",
        "https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php"]
run(URLS, ["REDCap", "registry", "regulation", "CommCare", "districts", "community health workers", "SAPRIN", "notifiable"])
