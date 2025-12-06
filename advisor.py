import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TravelAdvisor:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Warning: OPENAI_API_KEY not found in environment variables.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)

    def get_advice(self, destination, duration, people_count):
        if not self.client:
            return "Error: API key not configured. Please set OPENAI_API_KEY in a .env file."

        prompt = self._create_prompt(destination, duration, people_count)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo", # You can change this to gpt-4 if available
                messages=[
                    {"role": "system", "content": "You are a helpful travel assistant focused on sustainable and eco-friendly travel."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"An error occurred while fetching advice: {str(e)}"

    def _create_prompt(self, destination, duration, people_count):
        return (
            f"I am planning a trip to {destination} for {duration}. "
            f"There will be {people_count} people traveling. "
            f"Please provide a summary of the destination and detailed advice on how to be "
            f"an environmentally responsible traveler there. "
            f"Include tips on:\n"
            f"1. Local environmental challenges to be aware of.\n"
            f"2. Eco-friendly transportation options.\n"
            f"3. Sustainable accommodation or activities.\n"
            f"4. Cultural norms regarding nature and waste.\n"
            f"5. Specific 'do's and don'ts' for this location to minimize our footprint."
        )
