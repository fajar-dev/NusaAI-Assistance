import asyncio
from src.services.vector_service import vector_service

async def main():
    # vector_store.add_documents in vector_service.seed_data might be sync, 
    try:
        if asyncio.iscoroutinefunction(vector_service.get_vector_store().add_documents):
            await vector_service.seed_data()
        else:
            vector_service.seed_data()
    except Exception as e:
        # Fallback
        print(f"Error seeding: {e}")
        vector_service.seed_data()

if __name__ == "__main__":
    asyncio.run(main())
