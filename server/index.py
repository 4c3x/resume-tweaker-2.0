from flask import Flask, request, jsonify, make_response

app = Flask(__name__)

@app.route('/tweak', methods=['POST', 'OPTIONS'])
def tweak():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    data = request.get_json()
    tweaked_resume = f"Tweaked: {data['resume']}"
    response = jsonify({'message': 'Tweaked', 'tweakedResume': tweaked_resume})
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response