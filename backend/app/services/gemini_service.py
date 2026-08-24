import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-flash-latest")


def ask_gemini(context: str, question: str):

    prompt = f"""
You are an AI assistant.

Answer the question naturally using ONLY the provided context.

Do not start with phrases like:
"Based on the provided context..."
"According to the context..."

Just answer directly.

If the answer is not found, reply:
"I could not find the answer in the uploaded document."

Context:
{context}

Question:
{question}
"""

    response = model.generate_content(prompt)

    return response.text
