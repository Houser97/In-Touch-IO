// socket.js
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketURL = 'https://in-touch-io.onrender.com'
// const SocketURL = 'http://localhost:3000'

export function useSocket(userId = '') {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SocketURL, {
      transports: ['websocket', 'polling', 'flashsocket']
    });

    newSocket.emit("setup", userId);
    newSocket.on("connection", () => {
      console.log('Cui cui');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('idInTouch') || '');
    const newSocket = io(SocketURL, {
      transports: ['websocket', 'polling', 'flashsocket']
    });

    newSocket.emit("setup", userId);
    newSocket.on("connection", () => {
      console.log('Cui cui');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Asegurarse de desconectar el socket cuando el componente se desmonte
    };
  }, []);

  return socket;
}