import { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client';
import { AuthContext } from "../providers/AuthProvider";

export const useSocket = (serverPath: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [online, setOnline] = useState(false);
    const { auth } = useContext(AuthContext);
    const { user } = auth;

    useEffect(() => {
        setOnline(!!socket?.connected);
    }, [socket])

    useEffect(() => {
        socket?.on('connect', () => setOnline(true));
    }, [socket])

    useEffect(() => {
        socket?.on('disconnect', () => setOnline(false));
    }, [socket])

    useEffect(() => {
        if (user.id) {
            socket?.emit('setup', user.id);
        }
    }, [socket, user.id])

    const connect = useCallback(() => {
        const token = localStorage.getItem('token');
        const socketTemp = io(serverPath, {
            transports: ['websocket', 'polling', 'flashsocket'],
            query: {
                'x-token': token
            }
        });
        setSocket(socketTemp);
    }, [serverPath]);

    const disconnect = useCallback(() => {
        socket?.disconnect();
    }, [socket]);

    return {
        socket,
        online,
        connect,
        disconnect
    };
}