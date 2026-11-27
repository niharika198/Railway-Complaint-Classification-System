
import re
import joblib

from pathlib import Path
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


# ----------------------------------
# 1. Load trained ML models
# ----------------------------------

MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "model"

tfidf_vectorizer = joblib.load(
    MODEL_DIR / "tfidf_vectorizer.pkl"
)

kmeans_model = joblib.load(
    MODEL_DIR / "kmeans_model.pkl"
)

cluster_names = joblib.load(
    MODEL_DIR / "cluster_names.pkl"
)

print("ML models loaded successfully!")


# ----------------------------------
# 2. Configure stopwords
# ----------------------------------

important_words = {
    "no",
    "not",
    "nor",
    "never"
}

custom_stopwords = set(stopwords.words("english")) - important_words

custom_stopwords.update({
    "sir",
    "please"
})


# ----------------------------------
# 3. Slang normalization dictionary
# ----------------------------------

slang_map = {
    "pls": "please",
    "plz": "please",
    "hlp": "help",
    "tkt": "ticket",
    "bcoz": "because",
    "abt": "about",
    "fr": "for",
    "rlys": "railways",
    "recvd": "received",
    "n": "and",
    "u": "you",
    "ur": "your",
    "smthng": "something",
    "wrkout": "workout",
    "tht": "that",
    "cn": "can",
    "r": "are",
    "w": "with",
    "yur": "your",
    "ny": "any",
    "msg": "message",
    "msgs": "messages",
    "recieve": "receive",
    "recieved": "received",
    "askd": "asked",
    "gav": "gave",
    "b": "be",
    "bcum": "become"
}


# ----------------------------------
# 4. Initialize lemmatizer
# ----------------------------------

lemmatizer = WordNetLemmatizer()


# ----------------------------------
# 5. Text preprocessing function
# ----------------------------------

def preprocess_text(text):

    if not isinstance(text, str):
        return ""

    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(
        r"https?://\S+|www\.\S+",
        " ",
        text
    )

    # Remove mentions
    text = re.sub(r"@\w+", " ", text)

    # Remove retweet markers
    text = re.sub(r"\brt\b", " ", text)

    # Preserve hashtag words
    text = re.sub(r"#(\w+)", r"\1", text)

    # Remove punctuation and unwanted symbols
    text = re.sub(
        r"[^a-zA-Z\s]",
        " ",
        text
    )

    # Tokenization
    tokens = word_tokenize(text)

    # Normalize slang
    tokens = [
        slang_map.get(word, word)
        for word in tokens
    ]

    # Remove stopwords while preserving negations
    tokens = [
        word for word in tokens
        if word not in custom_stopwords
        or word in important_words
    ]

    # Lemmatization
    tokens = [
        lemmatizer.lemmatize(word)
        for word in tokens
    ]

    return " ".join(tokens)


# ----------------------------------
# 6. Predict complaint category
# ----------------------------------

def predict_complaint(complaint):

    # Preprocess complaint
    cleaned_complaint = preprocess_text(complaint)

    if not cleaned_complaint.strip():
        raise ValueError(
            "Please enter a valid complaint."
        )

    # Convert text into TF-IDF features
    complaint_vector = tfidf_vectorizer.transform(
        [cleaned_complaint]
    )

    if complaint_vector.nnz == 0:
        raise ValueError(
            "Complaint contains no recognizable terms."
        )

    # Predict cluster
    predicted_cluster = int(
        kmeans_model.predict(complaint_vector)[0]
    )

    # Get corresponding category
    predicted_category = cluster_names[predicted_cluster]

    return {
        "original_complaint": complaint,
        "cleaned_complaint": cleaned_complaint,
        "predicted_cluster": predicted_cluster,
        "predicted_category": predicted_category
    }
