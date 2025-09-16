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

def run_rag_app(file_path, text_query):
    """
    Runs the RAG application with a hardcoded file path and query.
    It saves the retrieved image to the root directory and avoids re-indexing if the index already exists.

    Args:
        file_path (str): The path to the document file.
        text_query (str): The text query for the RAG model.
    """
    
    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    # Load the Colpali model
    print("Loading Colpali model...")
    RAG = RAGMultiModalModel.from_pretrained("vidore/colpali", verbose=10)
    print("Colpali model loaded successfully!")

    # Define the index name
    index_name = "image_index"

    # Create the RAG index with overwrite=True for this example, or set to False
    # to avoid re-indexing on subsequent runs.
    print("Attempting to create RAG Index...")
    RAG.index(
        input_path=file_path,
        index_name=index_name,
        store_collection_with_index=True,
        overwrite=True,
    )
    print("RAG index creation/check complete.")
    
    # Search and get raw results
    print(f"Searching for query: '{text_query}'")
    results = RAG.search(text_query, k=1, return_base64_results=True)

    if not results:
        print("No results found for the given query.")
        return

    # Print the raw results before any further processing
    print("\n--- Raw Colpali Search Results ---")
    for result in results:
        print(result)

    # Decode and save the retrieved image
    image_data = base64.b64decode(results[0].base64)
    retrieved_image = Image.open(BytesIO(image_data))
    
    # Save the image to the root directory
    retrieved_image_path = "retrieved_image.png"
    retrieved_image.save(retrieved_image_path)
    print(f"\nRetrieved image saved to {retrieved_image_path}")
    
    print("\n--- Retrieved Image ---")
    retrieved_image.show()  # This will open the image in a default image viewer
    print("Image processed and shown successfully.")

    # Initialize the Gemini model
    multi_model_llm = "gemini-1.5-flash"
    model = genai.GenerativeModel(multi_model_llm)
    print(f"\nUsing multi-modal LLM: {multi_model_llm}")

    # Query the LLM
    print("Querying LLM...")
    contents = [text_query, retrieved_image]
    try:
        response = model.generate_content(contents)
        output = response.text
        print("\n--- LLM Response ---")
        print(output)
    except Exception as e:
        print(f"An error occurred during LLM query: {e}")

if __name__ == "__main__":
    # Hardcoded file path and text query
    hardcoded_file_path = "./doc/sss.pdf"
    hardcoded_text_query = "What are the complexity, sequential operations, and path lengths for different layer types like self-attention, recurrent, and convolutional?"
    # Ensure the directory exists
    if not os.path.exists(os.path.dirname(hardcoded_file_path)):
        os.makedirs(os.path.dirname(hardcoded_file_path))
    
    run_rag_app(hardcoded_file_path, hardcoded_text_query)
