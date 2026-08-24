from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def semantic_search(question: str, chunks: list[str], embeddings):

    question_embedding = model.encode([question])

    similarities = cosine_similarity(
        question_embedding,
        embeddings
    )

    best_index = similarities.argmax()

    return (
        chunks[best_index],
        similarities[0][best_index]
    )
