from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

generator = pipeline('text-generation', model='distilgpt2')

@app.route('/tweak', methods=['POST', 'OPTIONS'])
def tweak():
    try:
        if request.method == 'OPTIONS':
            return '', 200

        if request.content_type != 'application/json':
            return jsonify({'error': 'Content-Type must be application/json'}), 415

        data = request.get_json()
        if not data or 'resume' not in data or 'jobDesc' not in data:
            return jsonify({'error': 'Invalid input'}), 400

        resume = data['resume']
        job_desc = data['jobDesc']
        resume_lines = resume.split('\n')
        job_keywords = set(job_desc.lower().split())
        tweaked = []
        for line in resume_lines:
            if any(keyword in line.lower() for keyword in job_keywords):
                prompt = f"Enhance this resume line for a job needing {job_desc[:50]}: {line}"
                result = generator(prompt, max_length=50, num_return_sequences=1)[0]['generated_text']
                tweaked.append(result.strip())
            else:
                tweaked.append(line)
        tweaked_resume = '\n'.join(tweaked)
        return jsonify({'message': 'Tweaked', 'tweakedResume': tweaked_resume})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})