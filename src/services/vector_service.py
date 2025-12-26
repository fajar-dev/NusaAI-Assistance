from langchain_postgres.vectorstores import PGVector
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from src.core.config import settings

TABLE_NAME = "vector_store"

class VectorService:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.GOOGLE_EMBEDDING_MODEL, 
            google_api_key=settings.GOOGLE_API_KEY
        )
        self.connection_string = settings.PSYCOPG_DATABASE_URL
    
    def get_vector_store(self) -> PGVector:
        return PGVector(
            embeddings=self.embeddings,
            collection_name=TABLE_NAME,
            connection=self.connection_string,
            use_jsonb=True,
        )
    
    def seed_data(self):
        print("Seeding data...")
        vector_store = self.get_vector_store()
        
        documents = [
            Document(page_content="NusaWork is a comprehensive HR management platform designed to streamline human resource processes.", metadata={"source": "overview"}),
            Document(page_content="Features of NusaWork include attendance tracking, payroll management, and performance reviews.", metadata={"source": "features"}),
            Document(page_content="NusaWork offers a mobile app for employees to check in/out and view their payslips.", metadata={"source": "mobile"}),
            Document(page_content="The pricing for NusaWork starts at $10 per user per month for the basic plan.", metadata={"source": "pricing"}),
            Document(page_content="You can contact NusaWork support via email at support@nusawork.com.", metadata={"source": "contact"}),
        ]
        
        vector_store.add_documents(documents)
        print("Data seeded successfully!")

vector_service = VectorService()
