from bs4 import BeautifulSoup
import json
import yaml
import csv
import os

print(os.getcwd())

INPUT_FILE = "../database/austria_linz/LinkCollection.html"  # your Firefox export
FOLDER_NAME = "LinkCollectionWelcomeLinz"     # folder to extract

# ----------------------------
# Parse Firefox bookmark HTML
# ----------------------------

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

def extract_folder_links(soup, folder_name):
    folder = None
    for h3 in soup.find_all("h3"):
        if h3.text.strip() == folder_name:
            folder = h3.find_next("dl")
            break
    if folder is None:
        raise ValueError(f"Folder '{folder_name}' not found.")

    links = []
    for a in folder.find_all("a"):
        links.append({
            "title": a.text.strip(),
            "url": a.get("href"),
            "add_date": a.get("add_date"),
            "last_modified": a.get("last_modified"),
        })
    return links

links = extract_folder_links(soup, FOLDER_NAME)

# ----------------------------
# Save as JSON
# ----------------------------
with open("../database/austria_linz/linkcollection.json", "w", encoding="utf-8") as f:
    json.dump(links, f, indent=4, ensure_ascii=False)

# ----------------------------
# Save as YAML
# ----------------------------
with open("../database/austria_linz/linkcollection.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(links, f, allow_unicode=True)

# ----------------------------
# Save as CSV
# ----------------------------
with open("../database/austria_linz/linkcollection.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["title", "url", "add_date", "last_modified"])
    writer.writeheader()
    writer.writerows(links)

print("Finished: JSON, YAML and CSV created.")
