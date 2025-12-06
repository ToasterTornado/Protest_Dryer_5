from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
from app.services.advisor import TravelAdvisor

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Configure templates
templates = Jinja2Templates(directory="app/templates")

advisor = TravelAdvisor()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/advice", response_class=HTMLResponse)
async def get_advice(
    request: Request,
    destination: str = Form(...),
    duration: str = Form(...),
    people_count: int = Form(...)
):
    advice = advisor.get_advice(destination, duration, str(people_count))
    return templates.TemplateResponse("index.html", {
        "request": request,
        "advice": advice,
        "destination": destination
    })

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
