const socket = io();

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sendMessage() {
    const inputElement = document.getElementById('messageInput');
    const message = inputElement.value;
    if (message.trim() !== '') {
        const sanitizedMessage = escapeHtml(message);
        socket.send(JSON.stringify({
            username: window.username,
            message: sanitizedMessage,
            color: window.textColor
        }));
        inputElement.value = '';
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('messageInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission or newline
        sendMessage();
    }
});

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        window.username = escapeHtml(username);
        window.textColor = document.getElementById('colorPicker').value; // Get selected color
        document.getElementById('usernamePrompt').style.display = 'none';
        document.getElementById('chatroom').style.display = 'block';
    }
});

// Handle receiving chat history from the server
socket.on('history', (history) => {
    history.forEach(data => {
        const { username, message, color } = JSON.parse(data);
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<span style="color: ${color};">${username}: ${message}</span>`; // Safely append text with color
        document.getElementById('messages').appendChild(messageElement);
    });
});

// Handle receiving new messages
socket.on('message', (data) => {
    const { username, message, color } = JSON.parse(data);
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${color};">${username}: ${message}</span>`; // Safely append text with color
    document.getElementById('messages').appendChild(messageElement);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

// Ensure chatroom is hidden initially
document.getElementById('chatroom').style.display = 'none';
