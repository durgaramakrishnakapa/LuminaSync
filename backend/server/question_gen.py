import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables from .env file (if needed)
load_dotenv()

# Configure Gemini API key
gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAfmQVBvO8IHaV5BuZRq_w0x4JsC_HJzEk")
genai.configure(api_key=gemini_api_key)

# System prompt to guide the LLM
SYSTEM_PROMPT = """
You are given a block of technical or academic text that may contain complex descriptions, tables, equations, or multiple concepts.

Your task is to:

Carefully read and understand the text to identify its main ideas, key comparisons, or core technical concepts.

Extract exactly two distinct key ideas or topics being discussed.

For each of the two key ideas, formulate a single, simplified question that:

- Captures the essence of that idea,
- Is concise (one line only),
- Uses plain language where possible, while preserving technical accuracy,
- Avoids unnecessary jargon unless it's essential to understanding.

Formatting Instructions:

Return two numbered questions (1 and 2).

Each question should be a single sentence.

Do not include any extra commentary, summaries, or explanations—only the two questions.
"""

# Initialize the Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction=SYSTEM_PROMPT
)

# FastAPI app initialization
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class TextQuery(BaseModel):
    query: str

@app.post("/generate-questions/")
async def generate_questions(payload: TextQuery):
    input_text = payload.query.strip()
    if not input_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        response = model.generate_content(input_text)
        return {"questions": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")

# Run using: python question_generation_api.py
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
