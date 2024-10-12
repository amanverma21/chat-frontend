
import React, { useState, useEffect, useContext } from 'react';
import socket from '../socket';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {

    socket.on('connect', () => {
      
      console.log('Socket connected:', socket.id);
    });

    socket.on('chatHistory', (history) => {
      console.log('Received chat history:', history);
      setMessages(history);
    });

    socket.on('message', (data) => {
      console.log('Received message from server:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('chatHistory');
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        Text: message, 
        authorId: user.id,
        authorUsername: user.username,
      };
      console.log('Sending message:', messageData);
      socket.emit('message', messageData);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.author.username}: </strong>
            {msg.Text}
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
