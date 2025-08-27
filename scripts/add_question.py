#!/usr/bin/env python3
"""
Script to add questions to the DevOps quiz database.
Usage: python3 add_question.py
"""

import json
import os

def load_questions():
    """Load existing questions from JSON file."""
    questions_file = '../assets/data/questions.json'
    if os.path.exists(questions_file):
        with open(questions_file, 'r') as f:
            return json.load(f)
    return {"junior": [], "competent": [], "senior": []}

def save_questions(questions):
    """Save questions to JSON file."""
    questions_file = '../assets/data/questions.json'
    with open(questions_file, 'w') as f:
        json.dump(questions, f, indent=2)

def add_question():
    """Interactive function to add a new question."""
    print("\n=== DevOps Quiz - Add New Question ===\n")
    
    # Get level
    levels = ["junior", "competent", "senior"]
    print("Available levels:")
    for i, level in enumerate(levels, 1):
        print(f"{i}. {level}")
    
    while True:
        try:
            level_choice = int(input("\nSelect level (1-3): ")) - 1
            if 0 <= level_choice < len(levels):
                level = levels[level_choice]
                break
        except ValueError:
            pass
        print("Invalid choice. Please enter 1, 2, or 3.")
    
    # Get category
    categories = [
        "git", "github", "gitlab", "docker", "kubernetes", 
        "aws", "azure", "gcp", "linux", "python", 
        "monitoring", "debug", "network", "devops-principles"
    ]
    
    print(f"\nAvailable categories:")
    for i, cat in enumerate(categories, 1):
        print(f"{i:2d}. {cat}")
    
    while True:
        try:
            cat_choice = int(input(f"\nSelect category (1-{len(categories)}): ")) - 1
            if 0 <= cat_choice < len(categories):
                category = categories[cat_choice]
                break
        except ValueError:
            pass
        print(f"Invalid choice. Please enter a number between 1 and {len(categories)}.")
    
    # Get question details
    question_text = input("\nEnter the question: ").strip()
    
    print("\nEnter 4 answer options:")
    options = []
    for i in range(4):
        option = input(f"Option {i+1}: ").strip()
        options.append(option)
    
    while True:
        try:
            correct = int(input("\nWhich option is correct? (1-4): ")) - 1
            if 0 <= correct < 4:
                break
        except ValueError:
            pass
        print("Invalid choice. Please enter 1, 2, 3, or 4.")
    
    explanation = input("\nEnter explanation: ").strip()
    link = input("Enter documentation link (optional): ").strip()
    
    # Create question object
    new_question = {
        "category": category,
        "question": question_text,
        "options": options,
        "correct": correct,
        "explanation": explanation
    }
    
    if link:
        new_question["link"] = link
    
    # Add to questions database
    questions = load_questions()
    questions[level].append(new_question)
    save_questions(questions)
    
    print(f"\n✅ Question added successfully to {level} level!")
    print(f"Total questions in {level}: {len(questions[level])}")
    
    # Preview the question
    print(f"\n--- Preview ---")
    print(f"Level: {level}")
    print(f"Category: {category}")
    print(f"Question: {question_text}")
    for i, option in enumerate(options, 1):
        marker = "✓" if i-1 == correct else " "
        print(f"  {marker} {i}. {option}")
    print(f"Explanation: {explanation}")
    if link:
        print(f"Link: {link}")

def show_stats():
    """Show statistics about current questions."""
    questions = load_questions()
    
    print("\n=== Question Database Statistics ===\n")
    
    total = 0
    for level in ["junior", "competent", "senior"]:
        count = len(questions.get(level, []))
        total += count
        print(f"{level.capitalize()}: {count} questions")
        
        # Count by category
        categories = {}
        for q in questions.get(level, []):
            cat = q.get("category", "unknown")
            categories[cat] = categories.get(cat, 0) + 1
        
        if categories:
            for cat, count in sorted(categories.items()):
                print(f"  {cat}: {count}")
        print()
    
    print(f"Total questions: {total}")

def main():
    """Main function."""
    while True:
        print("\n=== DevOps Quiz Manager ===")
        print("1. Add new question")
        print("2. Show statistics")
        print("3. Exit")
        
        choice = input("\nSelect option (1-3): ").strip()
        
        if choice == "1":
            add_question()
        elif choice == "2":
            show_stats()
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
