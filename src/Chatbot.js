// src/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css'; // We'll create this file for styling

const RASA_SERVER_URL = 'http://localhost:5005/webhooks/rest/webhook';
const SENDER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Function to scroll to the bottom of the messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Function to add a message to the chat
    const addMessage = (text, sender) => {
        setMessages(prevMessages => [...prevMessages, { text, sender }]);
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        addMessage(userMessage, 'user');
        setInput('');

        try {
            const response = await axios.post(RASA_SERVER_URL, {
                sender: SENDER_ID,
                message: userMessage
            });

            if (response.data && response.data.length > 0) {
                response.data.forEach(botResponse => {
                    addMessage(botResponse.text, 'bot');
                });
            }
        } catch (error) {
            console.error('Error connecting to Rasa:', error);
            addMessage("I'm having trouble connecting to my brain. Please make sure the Rasa server is running.", 'bot');
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-input-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about weather or packing..."
                    autoFocus
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatbot;