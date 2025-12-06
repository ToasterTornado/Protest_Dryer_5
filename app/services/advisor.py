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
        # return (
        #     """I am planning a trip to {destination} for {duration}.
        #     There will be {people_count} people traveling. "
        #     Please provide a summary of the destination and detailed advice on how to be
        #     an environmentally responsible traveler there.
        #     Include tips on:
        #     1. Local environmental challenges to be aware of.
        #     2. Eco-friendly transportation options.
        #     3. Sustainable accommodation or activities.
        #     4. Cultural norms regarding nature and waste.
        #     5. Specific 'do's and don'ts' for this location to minimize our footprint."""
        # )
        return (
            f"""

            I am a tourist who arrived at the city of {destination} where I had not been to before and don't know anything.
            I am staying in there for {duration} and am in a group of {people_count}
            First, answer whether the city exists in the form "/Exists? yes/no"
            Secondly, type the city name in the form "/City? city_name". If it was mistyped, then assume the likely city
            Then, you have to act as a knowledgable resident of the city of {destination} who knows everything and give me advice what to do in the city.
            You should give the advice in the form of a list and avoid all the excessive sentences like "Sure! Enjoy city! and etc."
            """
        )
