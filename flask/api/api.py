from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tmp/tmp.db"
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self) -> str:
        return super().__repr__()

def message_serializer(mess):
    return {
        'id': mess.id,
        'content': mess.content
    }

@app.route('/api', methods=['GET'])
def index():
    return jsonify([*map(message_serializer, Message.query.all())])

@app.route('/api/create', methods=['POST'])
def create():
    request_data = json.loads(request.data)
    message = Message(content=request_data['content'])
    db.session.add(message)
    db.session.commit()

    return {'201': 'Create success'}
    
@app.route('/api/<int:id>', methods=['GET'])
def show(id):
    return jsonify([*map(message_serializer, Message.query.filter_by(id=id))])

@app.route('/api/<int:id>', methods=['DELETE'])
def delete(id):
    request_data = json.loads(request.data)
    Message.query.filter_by(id=request_data['id']).delete()
    db.session.commit()
    return { '204': 'Delete success'}

if __name__ == '__main__':
    app.run(debug=True)