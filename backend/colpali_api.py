import base64
from byaldi import RAGMultiModalModel
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import os
import shutil
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBQrkYzBSrdon7OkIGquOWHLEGI1a3VcYI")
genai.configure(api_key=gemini_api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploaded_files"
PDF_FILE_PATH = os.path.join(UPLOAD_DIR, "document.pdf")
RAG = None

def initialize_rag(file_path):
    global RAG
    print("Loading Colpali model...")
    RAG = RAGMultiModalModel.from_pretrained("vidore/colpali", verbose=10)
    print("Colpali model loaded successfully!")

    index_name = "image_index"

    print("Creating RAG index...")
    RAG.index(
        input_path=file_path,
        index_name=index_name,
        store_collection_with_index=True,
        overwrite=True,
    )
    print("RAG index creation complete.")

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # Save uploaded file
    with open(PDF_FILE_PATH, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        initialize_rag(PDF_FILE_PATH)
        return {"message": "PDF uploaded and RAG initialized successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize RAG: {e}")

@app.post("/query/")
async def query_pdf(query: str):
    if RAG is None:
        raise HTTPException(status_code=400, detail="No PDF uploaded or RAG not initialized.")

    print(f"Processing query: {query}")
    results = RAG.search(query, k=1, return_base64_results=True)

    if not results:
        return {"chunks": [], "image_base64": None, "message": "No results found."}

    image_data = base64.b64decode(results[0].base64)
    retrieved_image = Image.open(BytesIO(image_data))
    image_path = "retrieved_image.png"
    retrieved_image.save(image_path)

    multi_model_llm = "gemini-1.5-flash"
    model = genai.GenerativeModel(multi_model_llm)

    contents = [query, retrieved_image]
    try:
        response = model.generate_content(contents)
        llm_output = response.text
    except Exception as e:
        llm_output = f"LLM Error: {e}"

    return JSONResponse(content={
        "query": query,
        "chunks": [llm_output],
        "image_base64": base64.b64encode(image_data).decode('utf-8')
    })

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
