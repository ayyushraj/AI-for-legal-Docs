from flask import Flask, request, jsonify
import os
import json
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from llama_index import ServiceContext, set_global_service_context
from llama_index import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings import GradientEmbedding
from llama_index.llms import GradientBaseModelLLM

app = Flask(__name__)
from flask_cors import CORS

CORS(app)


# Load environment variables
from dotenv import load_dotenv

# Load variables from token.env file
load_dotenv('token.env')

# Access the environment variables
access_token = os.getenv("GRADIENT_ACCESS_TOKEN")
workspace_id = os.getenv("GRADIENT_WORKSPACE_ID")


# Load Cassandra credentials
with open("temp_db-token.json") as f:
    secrets = json.load(f)

CLIENT_ID = secrets["clientId"]
CLIENT_SECRET = secrets["secret"]

# Cassandra connection setup
cloud_config = {'secure_connect_bundle': 'secure-connect-temp-db.zip'}
auth_provider = PlainTextAuthProvider(CLIENT_ID, CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()

# Gradient setup
llm = GradientBaseModelLLM(
    base_model_slug="llama2-7b-chat",
    max_tokens=400,
)

embed_model = GradientEmbedding(
    gradient_access_token=os.environ["GRADIENT_ACCESS_TOKEN"],
    gradient_workspace_id=os.environ["GRADIENT_WORKSPACE_ID"],
    gradient_model_slug="bge-large",
)

# Service context setup
service_context = ServiceContext.from_defaults(
    llm=llm,
    embed_model=embed_model,
    chunk_size=256,
)
set_global_service_context(service_context)

# Load documents
documents_path = "content/Documents"
documents = SimpleDirectoryReader(documents_path).load_data()
print(f"Loaded {len(documents)} document(s).")

# Vector store index setup
index = VectorStoreIndex.from_documents(documents, service_context=service_context)
query_engine = index.as_query_engine()

# Flask API endpoint
@app.route('/query', methods=['POST'])
def query():
    data = request.json
    user_query = data.get('query', '')
    response = query_engine.query(user_query)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=50)
