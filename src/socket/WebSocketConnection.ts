import type { ConnectionState } from "../data/WebSocketContext.ts";
import {ConnectionHolder} from "./ConnectionHolder.ts";
import type {DenyAuthenticationMessage, InboundMessages, MessageType} from "./Protocol.ts";
import type {Dispatch, SetStateAction} from "react";
import {getWebSocketUrl} from "../data/ServerConfig.ts";

let connection: ConnectionHolder | null = null;

type MessageHandler<T extends InboundMessages> = (msg: T) => void;
const listeners : Map<MessageType, Set<MessageHandler<InboundMessages>>> = new Map();

type MessageOfType<T extends MessageType> = Extract<InboundMessages, { type: T }>;

export function setConnection(newConnection : ConnectionHolder) {
    if(connection) {
        connection.close();
    }
    connection = newConnection;
}
export function getConnection() : ConnectionHolder | null {
    return connection;
}

function isCurrentSocket(candidate : WebSocket) : boolean {
    const holder : ConnectionHolder | null = getConnection()
    if(holder == null) {
        return false;
    }
    return holder.isCurrentConnection(candidate);
}
export function disconnect() {
    const holder : ConnectionHolder | null = getConnection();
    if(holder != null) {
        holder.close()
    }
    connection = null;
}
export function addListener<T extends MessageType> (
    type: T,
    listener: (msg: MessageOfType<T>) => void): () => void {
    if (!listeners.has(type)) {
        listeners.set(type, new Set<MessageHandler<InboundMessages>>());
    }
    listeners.get(type)!.add(listener as MessageHandler<InboundMessages>);
    return () => listeners.get(type)?.delete(listener as MessageHandler<InboundMessages>);
}


export async function establishConnection(connectionStateDispatcher : Dispatch<SetStateAction<ConnectionState>>, onDeniedAuthentication: () => void) {
    const socket : WebSocket = new WebSocket(getWebSocketUrl());
    const connection : ConnectionHolder = new ConnectionHolder(socket);
    setConnection(connection);

    socket.onopen = () =>  {

    }
    socket.onclose = () => {
        if(isCurrentSocket(socket)) {
            connectionStateDispatcher("disconnected");
        }
    }
    socket.onmessage = (event : MessageEvent) => {
        const msg = JSON.parse(event.data) as InboundMessages;
        switch (msg.type) {
            case "confirm_authentication":
                console.log("Authentication confirmed.")
                connectionStateDispatcher("connected")
                break;
            case "denied_authentication":
                { const deniedMessage = msg as DenyAuthenticationMessage;
                console.log("Authentication denied.");
                connectionStateDispatcher("connection_rejected")
                onDeniedAuthentication();
                break; }
        }
        const handlers : Set<MessageHandler<InboundMessages>> | undefined = listeners.get(msg.type)
        if(handlers) {
            handlers.forEach(handler => handler(msg));
        }
    }
}
export function closeConnection() {
    getConnection()?.close();
    connection = null;
}