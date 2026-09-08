import {type ReactNode, useEffect, useState} from "react";
import {useAuth} from "../data/AuthContext.ts";
import {ConnectionContext, type ConnectionState} from "../data/WebSocketContext.ts";
import {establishConnection} from "../socket/WebSocketConnection.ts";


export function WebSocketProvider({ children }: { children: ReactNode }): React.JSX.Element {
    const {isLoggedIn, logOut} = useAuth();
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

    useEffect(() => {
        (async () => {
            if (isLoggedIn && connectionState === "disconnected") {
                establishConnection(setConnectionState, () => {
                    // Todo: Insert Notification Provider callback
                });
            }
        })();
    }, [connectionState, isLoggedIn]);
    const connect = async () => {
        establishConnection(setConnectionState, () => {
            // Todo: Insert callback
        })
    };
    const disconnect = async () => {

    }

    return (<ConnectionContext.Provider value={{connectionState, connect, disconnect}}>
        {children}
    </ConnectionContext.Provider>)
}