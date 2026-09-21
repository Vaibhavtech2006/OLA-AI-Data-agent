import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

class RAGTools:
    def __init__(self):
        # Using lightweight, fast open-source embeddings
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.persist_directory = "data/chroma_db"
        
        # Initialize and populate vector DB if it doesn't exist
        if not os.path.exists(self.persist_directory):
            print("Initializing new Vector Database for RAG...")
            docs = [
                Document(page_content="COMPANY POLICY: The target customer demographic is 18-35 year olds in tier-1 metro cities."),
                Document(page_content="KPI DEFINITION: Churn rate is calculated as (Lost Customers / Total Customers at start) * 100."),
                Document(page_content="FINANCIAL GOAL: The Q3 target is to reduce cloud infrastructure costs by 15% using optimized ML models."),
                Document(page_content="DATA DICTIONARY: The 'status' column in historical_prices.csv uses '1' for Active and '0' for Delisted.")
            ]
            self.vectorstore = Chroma.from_documents(docs, self.embeddings, persist_directory=self.persist_directory)
        else:
            self.vectorstore = Chroma(persist_directory=self.persist_directory, embedding_function=self.embeddings)

    def search_knowledge(self, query: str) -> str:
        results = self.vectorstore.similarity_search(query, k=2)
        if not results:
            return "No relevant company knowledge found in the vector database."
        
        context = "\n".join([f"- {doc.page_content}" for doc in results])
        return f"Found relevant context in Vector DB:\n{context}"