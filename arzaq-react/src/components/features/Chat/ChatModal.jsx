// src/components/features/Chat/ChatModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoSend, IoPersonCircleOutline } from 'react-icons/io5';
import styles from './ChatModal.module.css';

/**
 * ChatModal Component
 * Simple chat interface for users to communicate about food items
 */
const ChatModal = ({ isOpen, onClose, recipientName, postTitle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'recipient',
      text: `Hi! Thanks for your interest in "${postTitle}". When can you pick it up?`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate response (in real app, this would be WebSocket or API call)
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        sender: 'recipient',
        text: 'Great! Looking forward to meeting you.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <IoPersonCircleOutline size={40} />
            <div>
              <h3>{recipientName}</h3>
              <span className={styles.status}>Active now</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoClose size={28} />
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.recipientMessage
              }`}
            >
              <div className={styles.messageBubble}>
                <p>{message.text}</p>
                <span className={styles.messageTime}>{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={inputValue.trim() === ''}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
