# Trip Genie

Trip Genie is an application the help tourists or imigrants that are not familiar with their destination city to adjust and get around more easily and enhance their experience. 

## Use walkthrough

### Page 1: Enter travel details
User enters the following datapoints:

    1. Destination City
    2. Timeframe (from) -> (to)
    3. Activities (given + your own ideas)
    4. Any information the user would like to provide to enhance recommendations
    
### Page 2: Basic App suggestions
The most important apps used locally are sugested with download button:

    1. Local public transport app
    2. if exists CityBike or Scooter apps

### Page 3: #TODO



## Technical Details & Setup Guide

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Backend Setup (FastAPI)

1.  **Create and Activate Virtual Environment:**
    ```bash
    # Create venv
    python3 -m venv .venv
    
    # Activate venv (macOS/Linux)
    source .venv/bin/activate
    # On Windows use: .venv\Scripts\activate
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the Backend Server:**
    ```bash
    # Run with hot-reload enabled
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.
    API Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

### 2. Frontend Setup (React + Vite)

1.  **Navigate to the UI directory:**
    ```bash
    cd UI
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Ensure you have a `.env` file in the `UI` directory with your Google Maps API key:
    ```env
    VITE_GOOGLE_MAPS_API_KEY="your_api_key_here"
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The UI will be available at `http://localhost:8080`.

5.  **Build for Production:**
    ```bash
    npm run build
    ```

### 3. Running the Full Application
To run the full application, you need two terminal windows:
1.  **Terminal 1 (Backend):** `uvicorn app.main:app --reload`
2.  **Terminal 2 (Frontend):** `cd UI && npm run dev`

The frontend is configured to proxy API requests (starting with `/api`) to the backend at `http://localhost:8000`.