import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { AuthContext } from "../providers/AuthProvider";

export const useSocket = (serverUrl: string) => {
  const { auth } = useContext(AuthContext);
  const { user, status } = auth;

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    const token = localStorage.getItem("token");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(serverUrl, {
        accessTokenFactory: () => token ?? "",
        skipNegotiation: false,
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onclose(() => setConnected(false));
    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => setConnected(true));

    try {
      await connection.start();
      setConnected(true);
      connectionRef.current = connection;

      console.log("[SignalR] Connected!");

      if (user.id) {
        await connection.invoke("Setup", user.id);
      }
    } catch (error) {
      console.error("[SignalR] Connection failed:", error);
    }
  }, [serverUrl, user?.id, status]);

  const disconnect = useCallback(async () => {
    try {
      await connectionRef.current?.stop();
      setConnected(false);
    } catch (err) {
      console.error("[SignalR] Disconnect failed:", err);
    }
  }, []);

  const send = useCallback(async (method: string, ...args: any[]) => {
    if (
      !connectionRef.current ||
      connectionRef.current.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("[SignalR] Not connected");
      return;
    }

    try {
      await connectionRef.current.invoke(method, ...args);
    } catch (err) {
      console.error(`[SignalR] Error calling ${method}:`, err);
    }
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!connectionRef.current) return;

      connectionRef.current.on(event, callback);

      return () => {
        connectionRef.current?.off(event, callback);
      };
    },
    []
  );

  return {
    connection: connectionRef.current,
    connected,
    connect,
    disconnect,
    send,
    on,
  };
};
