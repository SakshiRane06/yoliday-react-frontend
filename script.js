// THIS IS THE MOST IMPORTANT PART
// Replace the URL with your REAL rasa-server URL from Railway
const RASA_API_ENDPOINT = "https://rasa-server-production-724c.up.railway.app/webhooks/rest/webhook";

const chatMessages = document.getElementById('chatbot-messages');
const form = document.getElementById('chatbot-input-form');
const userInput = document.getElementById('user-input');
const SENDER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage(message) {
    addMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch(RASA_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: SENDER_ID, message: message }),
        });
        const botResponses = await response.json();
        botResponses.forEach(botResponse => addMessage(botResponse.text, 'bot'));
    } catch (error) {
        console.error('Error connecting to Rasa:', error);
        addMessage("I'm having trouble connecting. Please check the Rasa server.", 'bot');
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = userInput.value.trim();
    if (message) sendMessage(message);
});

addMessage("Hello! I'm your Yoliday travel assistant.", 'bot');