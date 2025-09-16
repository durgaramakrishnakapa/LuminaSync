import os
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import TiDBVectorStore # <-- 1. IMPORT TiDBVectorStore
from sqlalchemy import text, create_engine


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

# Load embedding model (this part stays the same)
# The BAAI/bge-small-en-v1.5 model creates vectors with 384 dimensions.
embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

# Example documents
docs = ["LLaMA is a large language model.",
        "Embeddings map text into vectors.",
        "RAG improves chatbot accuracy.",
        "durga is student"]

# 2. CREATE AND STORE in TiDBVectorStore instead of FAISS
# This single command will:
#  - Connect to your TiDB Cloud database.
#  - Create a table named 'langchain_vector_store' (if it doesn't exist).
#  - Calculate the embeddings for your docs.
#  - Store the docs and their embeddings in the table.
print("Storing documents and embeddings in TiDB Cloud...")
vectorstore = TiDBVectorStore.from_texts(
    texts=docs,
    embedding=embeddings,
    connection_string=TIDB_CONNECTION_URL,
    # distance_strategy="COSINE" # You can choose the distance metric
)
print("Storage complete!")


# 3. QUERY from TiDB (this part looks exactly the same as before!)
query = ""
print(f"\nSearching for: '{query}'")
docs_found = vectorstore.similarity_search(query, k=1)

print("\nRetrieved docs:", [doc.page_content for doc in docs_found])