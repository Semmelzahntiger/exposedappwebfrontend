import {type ReactNode, useEffect, useState} from "react";
import {useAuth} from "../data/AuthContext.ts";
import {ConnectionContext, type ConnectionState} from "../data/WebSocketContext.ts";
import {establishConnection} from "../socket/WebSocketConnection.ts";
import {useNotification} from "../data/NotificationContext.ts";


export function WebSocketProvider({ children }: { children: ReactNode }): React.JSX.Element {
    const {isLoggedIn} = useAuth();
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
    const {push} = useNotification();

    useEffect(() => {
        (async () => {
            if (isLoggedIn && connectionState === "disconnected") {
                push("Establishing Server Connection...", "info")
                await establishConnection(setConnectionState, () => {
                    push("Connection closed.", "warning")
                });
                push("Established Server Connection.", "success")
            }
        })();
    }, [connectionState, isLoggedIn, push]);
    const connect = async () => {
        await establishConnection(setConnectionState, () => {
            // Todo: Insert callback
        })
    };
    const disconnect = async () => {

    }

    return (<ConnectionContext.Provider value={{connectionState, connect, disconnect}}>
        {children}
    </ConnectionContext.Provider>)
}