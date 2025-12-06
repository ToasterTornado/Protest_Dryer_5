import sys
from advisor import TravelAdvisor

def main():
    print("--- Eco-Conscious Travel Advisor ---")
    print("Get travel tips focused on environmental responsibility.\n")

    destination = input("Where do you want to go? ")
    if not destination:
        print("Destination is required.")
        return

    duration = input("How long will you be staying (e.g., '1 week', '3 days')? ")
    if not duration:
        print("Duration is required.")
        return

    people_count = input("How many people are traveling? ")
    if not people_count:
        print("Number of people is required.")
        return

    print("\nGathering information from the AI advisor... Please wait...\n")

    advisor = TravelAdvisor()
    advice = advisor.get_advice(destination, duration, people_count)

    print("-" * 40)
    print(f"Travel Advice for {destination}")
    print("-" * 40)
    print(advice)
    print("-" * 40)

if __name__ == "__main__":
    main()
