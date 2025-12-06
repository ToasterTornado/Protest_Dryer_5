import os
import glob
import requests
from typing import List, Dict

# === Existing local-link DB tool ===
DB_FOLDER = "../database"

def load_all_links() -> List[Dict]:
    all_links = []
    for file in glob.glob(DB_FOLDER + "/**/*.txt", recursive=True):
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                link = line.strip()
                if link:
                    all_links.append({"file": file, "url": link})
    return all_links

LINKS = load_all_links()

def search_links(query: str, top_k: int = 5) -> List[str]:
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


# === New: Web-search tool ===
WEBSEARCH_API_KEY = os.getenv("WEBSEARCH_API_KEY")  # set this env var

def web_search(query: str, top_k: int = 5) -> List[Dict]:
    """
    Calls the WebsearchAPI for `query`, returns a list of results with titles and URLs.
    Adjust this depending on the actual WebsearchAPI spec.
    """
    url = "https://api.websearchapi.com/search"  # replace with actual endpoint
    headers = {
        "Authorization": f"Bearer {WEBSEARCH_API_KEY}",
        "Accept": "application/json"
    }
    params = {
        "q": query,
        "num": top_k
    }
    resp = requests.get(url, headers=headers, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    # Example: adapt depending on API’s JSON format
    results = []
    for item in data.get("results", []):
        results.append({
            "title": item.get("title"),
            "url": item.get("link"),
            "snippet": item.get("snippet")
        })
    return results


# === Tool definitions for LLM integration ===
TOOLS = [
    {
        "name": "search_links",
        "description": "Search the local link database for relevant URLs.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": { "type": "string" }
            },
            "required": ["query"]
        }
    },
    {
        "name": "web_search",
        "description": "Search the internet for relevant information.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": { "type": "string" }
            },
            "required": ["query"]
        }
    }
]
