// Get the Rasa server URL from the environment variable set in Railway
// We provide a fallback for local testing.
const RASA_SERVER_URL = window.RASA_SERVER_URL || 'http://localhost:5005';
const RASA_API_ENDPOINT = `${RASA_SERVER_URL}/webhooks/rest/webhook`;

const chatMessages = document.getElementById('chatbot-messages');
const form = document.getElementById('chatbot-input-form');
const userInput = document.getElementById('user-input');

// A unique ID for the user's session
const SENDER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage(message) {
    addMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch(RASA_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: SENDER_ID,
                message: message,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const botResponses = await response.json();
        if (botResponses && botResponses.length > 0) {
            botResponses.forEach(botResponse => {
                addMessage(botResponse.text, 'bot');
            });
        }
    } catch (error) {
        console.error('Error connecting to Rasa:', error);
        addMessage("I'm having trouble connecting to my brain. Please make sure the Rasa server is running.", 'bot');
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Initial greeting from the bot
addMessage("Hello! I'm your Yoliday travel assistant. How can I help?", 'bot');