import { useEffect, useState } from 'react';

export const useWebSocket = (userId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket('ws://127.0.0.1:8080');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket received:', data);
        if (data.type === 'order_assignment') {
          setMessages(prev => [...prev, data.data]);
        } else {
          console.log('Received message with unhandled type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  return { messages };
};
