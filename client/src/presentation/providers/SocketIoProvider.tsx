import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Socket } from "socket.io-client";
import { useSocket } from "../hooks/useSocket";

interface SocketContextProps {
    socket: Socket | null;
    online: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
    online: false
});

export const SocketProvider = ({ children }: PropsWithChildren) => {
    const { socket, online, connect, disconnect } = useSocket('https://in-touch-io.onrender.com');
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (auth.status === 'authenticated') {
            connect();
        }
    }, [auth.status])

    useEffect(() => {
        if (auth.status !== 'authenticated') {
            disconnect();
        }
    }, [auth.status])

    return (
        <SocketContext.Provider value={{
            socket,
            online
        }}>
            {children}
        </SocketContext.Provider>
    )
}