import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv
from app.services.prompts import get_travel_plan_prompt, get_evaluation_prompt, get_places_prompt

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

    def get_advice(self, destination, duration, people_count, activities=None, custom_activity=None, advice_type="eco"):
        if not self.client:
            return {"error": "Error: API key not configured. Please set OPENAI_API_KEY in a .env file."}

        # Agent 1: The Travel Planner
        print(f"Agent 1: Generating {advice_type} travel plan for {destination}...")
        travel_plan = self._generate_travel_plan(destination, duration, people_count, activities, custom_activity, advice_type)
        
        if "An error occurred" in travel_plan:
            return {"error": travel_plan}

        # Agent 2: The Sustainability Evaluator
        print("Agent 2: Evaluating the plan for sustainability...")
        evaluation = self._evaluate_plan(travel_plan, destination)

        # Agent 3: The Places Recommender
        print("Agent 3: Finding specific places...")
        places = self._get_recommended_places(destination, activities, custom_activity)

        # Combine the results
        final_output = (
            f"{travel_plan}\n\n"
            f"---\n\n"
            f"### 🔍 Sustainability Audit (Agent 2)\n"
            f"{evaluation}"
        )
        
        return {
            "advice": final_output,
            "places": places
        }

    def _generate_travel_plan(self, destination, duration, people_count, activities, custom_activity, advice_type):
        prompt = get_travel_plan_prompt(destination, duration, people_count, activities, custom_activity, advice_type)
        
        system_content = "You are a helpful travel assistant focused on sustainable and eco-friendly travel."
        if advice_type == "efficient":
            system_content = "You are a highly efficient travel assistant focused on time-saving and convenience."

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"An error occurred while fetching advice: {str(e)}"

    def _evaluate_plan(self, travel_plan, destination):
        eval_prompt = get_evaluation_prompt(travel_plan, destination)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert environmental scientist and sustainability auditor."},
                    {"role": "user", "content": eval_prompt}
                ],
                temperature=0.5
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Could not evaluate plan: {str(e)}"

    def _get_recommended_places(self, destination, activities, custom_activity):
        try:
            prompt = get_places_prompt(destination, activities, custom_activity)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful travel assistant. Output valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            content = response.choices[0].message.content
            
            # Use regex to find JSON array
            match = re.search(r'\[.*\]', content, re.DOTALL)
            if match:
                json_str = match.group(0)
                return json.loads(json_str)
            else:
                print(f"Could not find JSON array in response. Raw content:\n{content}")
                return []
                
        except Exception as e:
            print(f"Error fetching places: {e}")
            if 'content' in locals():
                print(f"Raw content that failed: {content}")
            return []
