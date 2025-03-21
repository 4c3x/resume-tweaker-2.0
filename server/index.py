from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins for now

@app.route('/tweak', methods=['POST'])
def tweak():
    data = request.get_json()
    tweaked_resume = f"Tweaked: {data['resume']}"
    return jsonify({'message': 'Tweaked', 'tweakedResume': tweaked_resume})