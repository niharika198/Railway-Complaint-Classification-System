from app.ml_service import predict_complaint

complaints = [
    "There is no drinking water in my train coach",
    "My train is running very late",
    "The toilet in my coach is extremely dirty",
    "I am facing a problem with my ticket reservation"
]

for complaint in complaints:

    print("\nOriginal Complaint:", complaint)

    result = predict_complaint(complaint)

    print("Cleaned Text:", result["cleaned_complaint"])

    print("Predicted Cluster:", result["predicted_cluster"])

    print("Predicted Category:", result["predicted_category"])

    print("-" * 50)