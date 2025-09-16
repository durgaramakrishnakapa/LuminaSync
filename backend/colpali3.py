import base64
from byaldi import RAGMultiModalModel
from PIL import Image
from io import BytesIO
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Hardcode the Gemini API key
gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBQrkYzBSrdon7OkIGquOWHLEGI1a3VcYI")
genai.configure(api_key=gemini_api_key)

def initialize_rag(file_path):
    """
    Initialize the RAG model and create index if necessary.

    Args:
        file_path (str): The path to the document file.

    Returns:
        RAGMultiModalModel: Initialized and indexed RAG model.
    """
    print("Loading Colpali model...")
    RAG = RAGMultiModalModel.from_pretrained("vidore/colpali", verbose=10)
    print("Colpali model loaded successfully!")

    index_name = "image_index"

    print("Attempting to create RAG Index...")
    RAG.index(
        input_path=file_path,
        index_name=index_name,
        store_collection_with_index=True,
        overwrite=True,
    )
    print("RAG index creation/check complete.")

    return RAG

def query_and_respond(RAG, text_query):
    """
    Query the RAG model and show the results and LLM output.

    Args:
        RAG (RAGMultiModalModel): The RAG model.
        text_query (str): The text query from the user.
    """
    print(f"\nSearching for query: '{text_query}'")
    results = RAG.search(text_query, k=1, return_base64_results=True)

    if not results:
        print("No results found for the given query.")
        return

    print("\n--- Raw Colpali Search Results ---")
    for result in results:
        print(result)

    image_data = base64.b64decode(results[0].base64)
    retrieved_image = Image.open(BytesIO(image_data))
    
    retrieved_image_path = "retrieved_image.png"
    retrieved_image.save(retrieved_image_path)
    print(f"\nRetrieved image saved to {retrieved_image_path}")
    
    print("\n--- Retrieved Image ---")
    retrieved_image.show()

    multi_model_llm = "gemini-1.5-flash"
    model = genai.GenerativeModel(multi_model_llm)
    print(f"\nUsing multi-modal LLM: {multi_model_llm}")

    contents = [text_query, retrieved_image]
    try:
        response = model.generate_content(contents)
        output = response.text
        print("\n--- LLM Response ---")
        print(output)
    except Exception as e:
        print(f"An error occurred during LLM query: {e}")

if __name__ == "__main__":
    hardcoded_file_path = "./doc/sss.pdf"
    
    # Ensure the directory exists
    if not os.path.exists(os.path.dirname(hardcoded_file_path)):
        os.makedirs(os.path.dirname(hardcoded_file_path))

    if not os.path.exists(hardcoded_file_path):
        print(f"Error: File not found at {hardcoded_file_path}")
    else:
        RAG = initialize_rag(hardcoded_file_path)

        print("\n--- RAG Interactive Mode ---")
        print("Enter your query (or type 'q' to quit):")

        while True:
            user_query = input("\nYour query: ")
            if user_query.strip().lower() == 'q':
                print("Exiting RAG application. Goodbye!")
                break

            query_and_respond(RAG, user_query)
