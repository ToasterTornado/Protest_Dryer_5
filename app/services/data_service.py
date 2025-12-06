# Static data moved from frontend

CITIES = [
  { "name": "Linz", "countryName": "Austria" },
  { "name": "Vienna", "countryName": "Austria" },
  { "name": "Salzburg", "countryName": "Austria" },
  { "name": "Graz", "countryName": "Austria" },
  { "name": "Innsbruck", "countryName": "Austria" },
  { "name": "Munich", "countryName": "Germany" },
  { "name": "Berlin", "countryName": "Germany" },
  { "name": "Hamburg", "countryName": "Germany" },
  { "name": "Frankfurt", "countryName": "Germany" },
  { "name": "Prague", "countryName": "Czech Republic" },
  { "name": "Zurich", "countryName": "Switzerland" },
  { "name": "Geneva", "countryName": "Switzerland" },
  { "name": "Paris", "countryName": "France" },
  { "name": "Lyon", "countryName": "France" },
  { "name": "Milan", "countryName": "Italy" },
  { "name": "Rome", "countryName": "Italy" },
  { "name": "Venice", "countryName": "Italy" },
  { "name": "Florence", "countryName": "Italy" },
  { "name": "Amsterdam", "countryName": "Netherlands" },
  { "name": "Brussels", "countryName": "Belgium" },
  { "name": "Barcelona", "countryName": "Spain" },
  { "name": "Madrid", "countryName": "Spain" },
  { "name": "Lisbon", "countryName": "Portugal" },
  { "name": "Budapest", "countryName": "Hungary" },
  { "name": "Warsaw", "countryName": "Poland" },
  { "name": "Krakow", "countryName": "Poland" },
  { "name": "Copenhagen", "countryName": "Denmark" },
  { "name": "Stockholm", "countryName": "Sweden" },
  { "name": "Oslo", "countryName": "Norway" },
  { "name": "Helsinki", "countryName": "Finland" },
  { "name": "Dublin", "countryName": "Ireland" },
  { "name": "London", "countryName": "United Kingdom" },
  { "name": "Edinburgh", "countryName": "United Kingdom" },
]

CITY_COORDS = {
  "Linz": { "lat": 48.3069, "lng": 14.2858 },
  "Vienna": { "lat": 48.2082, "lng": 16.3738 },
  "Salzburg": { "lat": 47.8095, "lng": 13.0550 },
  "Graz": { "lat": 47.0707, "lng": 15.4395 },
  "Innsbruck": { "lat": 47.2692, "lng": 11.3928 },
  "Munich": { "lat": 48.1351, "lng": 11.5820 },
  "Berlin": { "lat": 52.5200, "lng": 13.4050 },
  "Prague": { "lat": 50.0755, "lng": 14.4378 },
  "Zurich": { "lat": 47.3769, "lng": 8.5417 },
  "Paris": { "lat": 48.8566, "lng": 2.3522 },
  "Amsterdam": { "lat": 52.3676, "lng": 4.9041 },
  "Rome": { "lat": 41.9028, "lng": 12.4964 },
}

def get_pois(city_name):
    center = CITY_COORDS.get(city_name, CITY_COORDS["Linz"])
    return [
        { "name": "Main Square", "type": "landmark", "position": center },
        { "name": "Central Station", "type": "transport", "position": { "lat": center["lat"] - 0.005, "lng": center["lng"] + 0.01 } },
        { "name": "Old Town", "type": "historic", "position": { "lat": center["lat"] + 0.003, "lng": center["lng"] - 0.008 } },
        { "name": "City Museum", "type": "culture", "position": { "lat": center["lat"] + 0.008, "lng": center["lng"] + 0.005 } },
    ]

def get_events(city_name):
    # In a real app, this would filter by city
    return [
        {
            "id": "1",
            "title": f"{city_name} Art Festival",
            "description": "World-renowned festival for art, technology, and society.",
            "date": "2024-09-04",
            "time": "10:00",
            "location": "City Center",
            "category": "Festival",
            "attendees": 5000,
        },
        {
            "id": "2",
            "title": f"{city_name} Market",
            "description": "Traditional market with local crafts and food.",
            "date": "2024-12-15",
            "time": "16:00",
            "location": "Main Square",
            "category": "Market",
            "attendees": 2000,
        },
        {
            "id": "3",
            "title": "Classical Concert",
            "description": "Classical music concert featuring local orchestra.",
            "date": "2024-09-20",
            "time": "19:30",
            "location": "Concert Hall",
            "category": "Concert",
            "attendees": 800,
        },
    ]

EMERGENCY_CONTACTS = [
  {
    "id": "1",
    "title": "Emergency Services",
    "number": "112",
    "description": "Police, Fire, Ambulance - European emergency number",
    "iconType": "alert",
    "color": "bg-emergency text-primary-foreground",
  },
  {
    "id": "2",
    "title": "Police",
    "number": "133",
    "description": "Local Police emergency line",
    "iconType": "shield",
    "color": "bg-ocean text-primary-foreground",
  },
  {
    "id": "3",
    "title": "Fire Brigade",
    "number": "122",
    "description": "Fire emergency services",
    "iconType": "flame",
    "color": "bg-coral text-primary-foreground",
  },
  {
    "id": "4",
    "title": "Ambulance",
    "number": "144",
    "description": "Medical emergency services",
    "iconType": "hospital",
    "color": "bg-sage text-primary-foreground",
  },
]

SAFE_ZONES = [
  { "name": "Central Police Station", "address": "City Center", "distance": "1.2 km" },
  { "name": "University Hospital", "address": "Medical District", "distance": "2.5 km" },
  { "name": "Tourist Information Center", "address": "Main Square", "distance": "0.8 km" },
]

TRIP_OPTIONS = {
    "transport": [
        { "id": "walking", "label": "Walking", "emoji": "🚶" },
        { "id": "public", "label": "Public Transit", "emoji": "🚌" },
        { "id": "bike", "label": "Bicycle", "emoji": "🚲" },
        { "id": "car", "label": "Car/Taxi", "emoji": "🚗" },
        { "id": "scooter", "label": "E-Scooter", "emoji": "🛴" },
    ],
    "food": [
        { "id": "local", "label": "Local Cuisine", "emoji": "🍽️" },
        { "id": "vegetarian", "label": "Vegetarian", "emoji": "🥗" },
        { "id": "vegan", "label": "Vegan", "emoji": "🌱" },
        { "id": "seafood", "label": "Seafood", "emoji": "🦐" },
        { "id": "streetfood", "label": "Street Food", "emoji": "🌮" },
        { "id": "fine", "label": "Fine Dining", "emoji": "🍷" },
        { "id": "cafe", "label": "Cafes", "emoji": "☕" },
        { "id": "budget", "label": "Budget Friendly", "emoji": "💰" },
    ],
    "accommodation": [
        { "id": "hotel", "label": "Hotel", "emoji": "🏨" },
        { "id": "hostel", "label": "Hostel", "emoji": "🛏️" },
        { "id": "airbnb", "label": "Apartment", "emoji": "🏠" },
        { "id": "boutique", "label": "Boutique Hotel", "emoji": "✨" },
    ]
}
