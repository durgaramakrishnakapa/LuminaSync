import os
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import TiDBVectorStore
from langchain_community.document_loaders import PyPDFLoader # <-- 1. IMPORT PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter # <-- 2. IMPORT RecursiveCharacterTextSplitter
from rich import print

# --- Connection Setup ---
# Replace with your actual path to the downloaded CA certificate
SSL_CA_PATH = "isrgrootx1.pem"

# Check if the CA certificate file exists
if not os.path.exists(SSL_CA_PATH):
    raise ValueError(f"SSL CA file not found at: {SSL_CA_PATH}. Please download it from your TiDB Cloud dashboard and update the path.")

# Your connection string from the TiDB Cloud dashboard
TIDB_USER = "4C9BATfCoi6NfJE.root"
TIDB_PASSWORD = "FcevNqikd5yrv8k7"
TIDB_HOST = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
TIDB_PORT = 4000
TIDB_DATABASE = "test"

# Construct the connection URL for SQLAlchemy
TIDB_CONNECTION_URL = (
    f"mysql+pymysql://{TIDB_USER}:{TIDB_PASSWORD}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DATABASE}"
    f"?ssl_ca={SSL_CA_PATH}"
)

# --- Your LangChain Logic ---

# Load embedding model
embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

# 3. LOAD and SPLIT the PDF
pdf_path = r"C:\Users\Rakes\OneDrive\Documents\projects\ColPali_RAG\doc\sss.pdf"
#path = r"C:\Users\Rakes\OneDrive\Documents\projects\ColPali_RAG"

print(f"Loading and splitting PDF from: {pdf_path}")
loader = PyPDFLoader(pdf_path)
documents = loader.load()

# Split the documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = text_splitter.split_documents(documents)
print(f"Split PDF into {len(docs)} chunks.")

# 4. CREATE AND STORE in TiDBVectorStore from documents
print("Storing documents and embeddings in TiDB Cloud...")
vectorstore = TiDBVectorStore.from_documents( # <--- Use .from_documents
    documents=docs,
    embedding=embeddings,
    connection_string=TIDB_CONNECTION_URL,
    # distance_strategy="COSINE"
)
print("Storage complete!")

# 5. QUERY from TiDB
query = "What is the maximum path length of the self attention layer?"
 # <--- Example query for a document
print(f"\nSearching for: '{query}'")
docs_found = vectorstore.similarity_search(query, k=1)

print("\nRetrieved docs:", [doc.page_content for doc in docs_found])