import os
import glob

DB_FOLDER = "../database"

def load_all_links():
    all_links = []

    for file in glob.glob(DB_FOLDER + "/**/*.txt", recursive=True):
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                link = line.strip()
                if link:
                    all_links.append({"file": file, "url": link})
    return all_links

LINKS = load_all_links()

def search_links(query, top_k=5):
    q = query.lower()
    scored = []

    for item in LINKS:
        filename = os.path.basename(item["file"]).lower()
        url = item["url"].lower()

        score = 0
        if q in filename:
            score += 2
        if q in url:
            score += 1

        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item["url"] for _, item in scored[:top_k]]
