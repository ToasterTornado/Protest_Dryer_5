from pathlib import Path

def _load_prompt(filename):
    current_dir = Path(__file__).parent.parent
    prompt_path = current_dir / "prompts" / filename
    with open(prompt_path, "r") as f:
        return f.read()

def get_travel_plan_prompt(destination, duration, people_count, activities=None, custom_activity=None, advice_type="eco"):
    filename = "travel_plan_efficient.txt" if advice_type == "efficient" else "travel_plan.txt"
    prompt_template = _load_prompt(filename)
    
    activities_str = ", ".join(activities) if activities else "None specified"
    if custom_activity:
        activities_str += f". Also interested in: {custom_activity}"
    
    return prompt_template.format(
        destination=destination,
        duration=duration,
        people_count=people_count,
        activities=activities_str
    )

def get_places_prompt(destination, activities=None, custom_activity=None):
    prompt_template = _load_prompt("places.txt")
    
    activities_str = ", ".join(activities) if activities else "General sightseeing"
    custom_str = f"Also interested in: {custom_activity}" if custom_activity else ""
    
    return prompt_template.format(
        destination=destination,
        activities=activities_str,
        custom_activity=custom_str
    )

def get_evaluation_prompt(travel_plan, destination):
    prompt_template = _load_prompt("evaluation.txt")
    return prompt_template.format(
        travel_plan=travel_plan,
        destination=destination
    )
