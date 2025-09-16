import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import TiDBVectorStore
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tempfile import NamedTemporaryFile
from typing import List
from pydantic import BaseModel
import uvicorn

# --- TiDB Connection Config ---
SSL_CA_PATH = "isrgrootx1.pem"

if not os.path.exists(SSL_CA_PATH):
    raise ValueError(f"SSL CA file not found at: {SSL_CA_PATH}. Please download it.")

TIDB_USER = "4C9BATfCoi6NfJE.root"
TIDB_PASSWORD = "FcevNqikd5yrv8k7"
TIDB_HOST = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
TIDB_PORT = 4000
TIDB_DATABASE = "test"

TIDB_CONNECTION_URL = (
    f"mysql+pymysql://{TIDB_USER}:{TIDB_PASSWORD}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DATABASE}"
    f"?ssl_ca={SSL_CA_PATH}"
)

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store TiDBVectorStore instance
vectorstore = None

class SearchResult(BaseModel):
    content: str

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    global vectorstore

    # Save the uploaded PDF temporarily
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
        temp_pdf.write(await file.read())
        temp_pdf_path = temp_pdf.name

    try:
        # Load and split the document
        loader = PyPDFLoader(temp_pdf_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        # Generate embeddings and store in TiDB
        embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        vectorstore = TiDBVectorStore.from_documents(
            documents=docs,
            embedding=embeddings,
            connection_string=TIDB_CONNECTION_URL,
        )

        return {"message": "PDF uploaded and indexed successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {e}")

    finally:
        os.remove(temp_pdf_path)


@app.post("/query/")
async def query_pdf(query: str = Form(...)):
    global vectorstore

    if vectorstore is None:
        raise HTTPException(status_code=400, detail="No PDF indexed yet. Upload a PDF first.")

    try:
        docs_found = vectorstore.similarity_search(query, k=3)
        results = [SearchResult(content=doc.page_content) for doc in docs_found]

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=3000)
