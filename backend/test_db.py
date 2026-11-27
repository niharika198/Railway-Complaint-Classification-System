from app.database import test_connection

if test_connection():
    print("Database is ready to use!")
else:
    print("Please check your MongoDB configuration.")