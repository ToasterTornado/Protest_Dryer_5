import json
import os
from datetime import datetime
from pathlib import Path
from tinydb import TinyDB
import uuid

class StorageService:
    def __init__(self):
        # Define paths
        self.base_dir = Path("data")
        self.json_files_dir = self.base_dir / "json_files"
        self.db_path = self.base_dir / "trips_db.json"

        # Create directories if they don't exist
        self.base_dir.mkdir(exist_ok=True)
        self.json_files_dir.mkdir(exist_ok=True)

        # Initialize TinyDB
        self.db = TinyDB(self.db_path)

    def save_trip(self, trip_data):
        """
        Saves trip data to both a JSON file and the TinyDB database.
        """
        # Add metadata
        trip_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        record = {
            "id": trip_id,
            "timestamp": timestamp,
            **trip_data
        }

        # 1. Save to TinyDB
        self.db.insert(record)

        # 2. Save to individual JSON file
        # Sanitize filename
        safe_dest = "".join([c for c in trip_data.get("destination", "unknown") if c.isalpha() or c.isdigit() or c==' ']).rstrip()
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{safe_dest.replace(' ', '_')}.json"
        file_path = self.json_files_dir / filename

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(record, f, indent=2, ensure_ascii=False)

        return trip_id
