import { useEffect, useState } from 'react';

export const useWebSocket = (userId: any) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket('ws://localhost:8080'); // connect to your WebSocket server

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'register',
        userId: userId,
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket received:', data);

      // Example: Only accept messages of type 'order_update'
      if (data.type === 'order_update') {
        setMessages(prev => [...prev, data.data]); // accumulate messages
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [userId]);

  return { messages };
};
