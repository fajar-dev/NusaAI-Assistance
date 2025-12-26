from langchain_core.documents import Document
from src.services.vector_service import VectorService

def main():
    print("Seeding data...")
    vector_service = VectorService()
    vector_store = vector_service.get_vector_store()

    docs = [
        Document(
            page_content="NusaWork is a comprehensive HR management platform designed to streamline human resource processes.",
            metadata={"source": "overview"},
        ),
        Document(
            page_content="Features of NusaWork include attendance tracking, payroll management, and performance reviews.",
            metadata={"source": "features"},
        ),
        Document(
            page_content="NusaWork offers a mobile app for employees to check in/out and view their payslips.",
            metadata={"source": "mobile"},
        ),
        Document(
            page_content="The pricing for NusaWork starts at $10 per user per month for the basic plan.",
            metadata={"source": "pricing"},
        ),
        Document(
            page_content="You can contact NusaWork support via email at support@nusawork.com.",
            metadata={"source": "contact"},
        ),
    ]

    vector_store.add_documents(docs)
    print(f"Data seeded successfully! inserted={len(docs)}")

if __name__ == "__main__":
    main()
