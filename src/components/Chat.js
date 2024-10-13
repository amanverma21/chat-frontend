import React, { useState, useEffect, useContext } from 'react';
import socket from '../socket';
import { AuthContext } from '../context/AuthContext';
import '../styles/Chat.css';
import Logout from './Logout';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const [clientSocketId, setClientSocketId] = useState(null); 

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setClientSocketId(socket.id); 
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
        socketId: clientSocketId, 
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          id: Math.random(),
          timestamp: new Date().toISOString(),
        },
      ]);

      console.log('Sending message:', messageData);
      socket.emit('message', messageData);
      setMessage(''); 
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id || Math.random()}
            className={`message ${msg.socketId === clientSocketId ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <span className="username">{msg.authorUsername || msg.author.username}</span>
              <p>{msg.Text}</p>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          placeholder="Enter your message and press ENTER"
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <Logout />
    </div>
  );
};

export default Chat;
