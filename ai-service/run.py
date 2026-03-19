import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get port from environment or use default
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    host = os.getenv("AI_SERVICE_HOST", "127.0.0.1")
    
    print("=" * 50)
    print("🚀 Starting ECIS AI Detection Service")
    print("=" * 50)
    print(f"📡 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"📚 Docs: http://{host}:{port}/docs")
    print(f"💪 Health: http://{host}:{port}/health")
    print("=" * 50)
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,  # Auto-reload during development
        log_level="info"
    )