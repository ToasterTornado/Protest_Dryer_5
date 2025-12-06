from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import uvicorn
import markdown
import os
from dotenv import load_dotenv
from app.services.advisor import TravelAdvisor
from app.services.storage import StorageService
import app.services.data_service as data_service

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Configure templates
templates = Jinja2Templates(directory="app/templates")

advisor = TravelAdvisor()
storage = StorageService()

class TripRequest(BaseModel):
    destination: str
    duration: str
    people_count: str
    activities: List[str] = []
    custom_activity: Optional[str] = ""
    advice_type: str

@app.post("/api/advice")
async def get_advice_api(trip: TripRequest):
    result = advisor.get_advice(
        trip.destination, 
        trip.duration, 
        trip.people_count, 
        trip.activities, 
        trip.custom_activity, 
        trip.advice_type
    )
    
    if isinstance(result, dict) and "error" in result:
        return {"error": result["error"]}

    # Save the result
    trip_data = {
        "destination": trip.destination,
        "duration": trip.duration,
        "people_count": trip.people_count,
        "activities": trip.activities,
        "custom_activity": trip.custom_activity,
        "advice_type": trip.advice_type,
        "advice": result["advice"],
        "places": result["places"]
    }
    storage.save_trip(trip_data)
    
    return result

@app.get("/api/cities")
async def get_cities():
    return data_service.CITIES

@app.get("/api/map-data")
async def get_map_data(city: str = "Linz"):
    return {
        "center": data_service.CITY_COORDS.get(city, data_service.CITY_COORDS["Linz"]),
        "pois": data_service.get_pois(city)
    }

@app.get("/api/events")
async def get_events(city: str = "Linz"):
    return data_service.get_events(city)

@app.get("/api/emergency-contacts")
async def get_emergency_contacts():
    return data_service.EMERGENCY_CONTACTS

@app.get("/api/safe-zones")
async def get_safe_zones():
    return data_service.SAFE_ZONES

@app.get("/api/trip-options")
async def get_trip_options():
    return data_service.TRIP_OPTIONS

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/advice", response_class=HTMLResponse)
async def get_advice(
    request: Request,
    destination: str = Form(...),
    duration: str = Form(...),
    people_count: str = Form(...),
    activities: list[str] = Form(default=[]),
    custom_activity: str = Form(default=""),
    advice_type: str = Form(...)
):
    result = advisor.get_advice(destination, duration, people_count, activities, custom_activity, advice_type)
    
    if isinstance(result, dict) and "error" in result:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "advice": result["error"],
            "destination": destination
        })

    # Save the result
    trip_data = {
        "destination": destination,
        "duration": duration,
        "people_count": people_count,
        "activities": activities,
        "custom_activity": custom_activity,
        "advice_type": advice_type,
        "advice": result["advice"],
        "places": result["places"]
    }
    storage.save_trip(trip_data)

    advice_html = markdown.markdown(result["advice"])
    
    return templates.TemplateResponse("result.html", {
        "request": request,
        "advice": advice_html,
        "places": result["places"],
        "destination": destination,
        "google_maps_api_key": os.getenv("GOOGLE_MAPS_API_KEY")
    })

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
