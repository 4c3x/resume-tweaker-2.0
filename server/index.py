from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/tweak', methods=['POST'])
def tweak():
    data = request.get_json()
    tweaked_resume = f"Tweaked: {data['resume']}"
    return jsonify({'message': 'Tweaked', 'tweakedResume': tweaked_resume})

if __name__ == '__main__':
    app.run()