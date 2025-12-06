import os
import glob
import requests
from typing import List, Dict
import json

# === Existing local-link DB tool ===
DB_FOLDER = "../database"

def load_all_links() -> List[Dict]:
    all_links = []

    # First, handle plain-text URL lists:
    for file in glob.glob(os.path.join(DB_FOLDER, "**", "*.txt"), recursive=True):
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                url = line.strip()
                if url:
                    all_links.append({"file": file, "url": url})

    # Then, handle JSON files:
    for file in glob.glob(os.path.join(DB_FOLDER, "**", "*.json"), recursive=True):
        with open(file, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    for url in data:
                        if isinstance(url, str):
                            all_links.append({"file": file, "url": url})
                elif isinstance(data, dict):
                    # adjust depending on your JSON structure, e.g. data["links"]
                    links = data.get("links", [])
                    for url in links:
                        if isinstance(url, str):
                            all_links.append({"file": file, "url": url})
            except json.JSONDecodeError:
                print(f"Warning: failed to parse JSON file {file}")
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
    url = "https://api.websearchapi.ai/ai-search"
    headers = {
        "Authorization": f"Bearer {WEBSEARCH_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "query": query,
        "maxResults": top_k,
        "includeContent": False,
        # adjust country / language as needed
        "country": "us",
        "language": "en"
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("results", []):
        results.append({
            "title": item.get("title"),
            "url": item.get("link") or item.get("url"),
            "snippet": item.get("snippet") or item.get("excerpt") or ""
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



