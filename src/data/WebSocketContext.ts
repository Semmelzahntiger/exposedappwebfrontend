import {type Context, createContext, useContext} from "react";

export type ConnectionState = "connecting" | "connected" | "disconnected" | "connection_rejected";

export type ConnectionValue = {
    connectionState: ConnectionState;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}
export const ConnectionContext : Context<ConnectionValue | null> = createContext<ConnectionValue | null>(null);

export function useConnectionState() {
    const ctx = useContext(ConnectionContext);
    if (!ctx) {
        throw new Error("useConnectionState() must be used within the ConnectionProvider");
    }
    return ctx;
}