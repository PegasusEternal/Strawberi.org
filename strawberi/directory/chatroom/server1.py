from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Store recent messages (adjust MAX_HISTORY as needed)
MAX_HISTORY = 100
chat_history = []

@app.route('/')
def home():
    return render_template('strawberi home.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/donate')
def donate():
    return render_template('donate.html')

@app.route('/chat')
def chat():
    return render_template('chatindex.html')

@socketio.on('connect')
def handle_connect():
    emit('history', chat_history)

@socketio.on('message')
def handle_message(data):
    # Add new message to history
    if len(chat_history) >= MAX_HISTORY:
        chat_history.pop(0)  # Remove oldest message if history is full
    chat_history.append(data)
    
    # Broadcast message to all connected clients
    emit('message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
