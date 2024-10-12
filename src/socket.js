import { io } from 'socket.io-client';

const socket = io('http://localhost:1337', {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to server with socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;
