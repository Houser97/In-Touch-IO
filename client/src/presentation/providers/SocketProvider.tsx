import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { HubConnection } from "@microsoft/signalr";
import { useSocket } from "../hooks/useSocket";

interface SignalRContextProps {
  connection: HubConnection | null;
  connected: boolean;
  send: (method: string, ...args: any[]) => Promise<void>;
  on: (
    event: string,
    callback: (...args: any[]) => void
  ) => (() => void) | void;
}

export const SocketContext = createContext<SignalRContextProps>({
  connection: null,
  connected: false,
  send: async () => {},
  on: () => {},
});

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { connection, connected, connect, disconnect, send, on } = useSocket(
    //"https://in-touch-io.onrender.com/chats"
    //"https://localhost:5001/signalR"
    import.meta.env.VITE_SOCKET_URL
  );
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.status === "authenticated") {
      connect();
    } else {
      disconnect();
    }
  }, [auth.status]);

  return (
    <SocketContext.Provider value={{ connection, connected, send, on }}>
      {children}
    </SocketContext.Provider>
  );
};
