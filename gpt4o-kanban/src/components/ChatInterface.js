import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import { IoSend, IoRefresh } from "react-icons/io5";

function ChatInterface({ onProjectDescription, onChatMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsThinking(true);

    try {
      if (userMessage.toLowerCase().includes('generate tasks')) {
        setIsGeneratingTasks(true);
        await onProjectDescription(userMessage);
        setIsGeneratingTasks(false);
      } else {
        const response = await onChatMessage(userMessage);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      }
      setIsThinking(false);
    } catch (error) {
      setIsThinking(false);
      setIsGeneratingTasks(false);
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error.", sender: 'bot' }]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setIsGeneratingTasks(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-interface">
        <div className="chat-log" ref={chatLogRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isThinking && (
            <div className="message bot thinking-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Ebb"
          />
          <div className="button-group">
            <button type="submit" className="icon-button">
              <IoSend />
            </button>
            <button type="button" className="icon-button" onClick={handleNewChat}>
              <IoRefresh />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;
