# Eco-Conscious Travel Advisor

This tool helps you plan your trips with a focus on environmental responsibility using AI.

## Setup

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure API Key:**
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and replace `your_api_key_here` with your actual OpenAI API key.

## Usage

### Command Line Interface
Run the CLI script:

```bash
python cli.py
```

Follow the prompts to enter your destination, duration, and group size.

### Web Interface (FastAPI)
To run the web prototype:

1.  Start the server:
    ```bash
    python -m app.main
    ```
    *Alternatively, you can use uvicorn directly:* `uvicorn app.main:app --reload`

2.  Open your browser and navigate to:
    [http://127.0.0.1:8000](http://127.0.0.1:8000)

3.  Fill out the form to get your eco-friendly travel advice.
