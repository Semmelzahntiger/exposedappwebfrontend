import type {OutboundMessages} from "./Protocol.ts";

export class ConnectionHolder {
    connection : WebSocket;
    hasClosed : boolean;
    constructor(connection : WebSocket) {
        this.connection = connection;
        this.hasClosed = false;
    }
    public getConnection() : WebSocket {
        return this.connection;
    }
    public close() : void {
        this.connection.close();
        this.hasClosed = true;
    }
    public hasConnectionClosed() : boolean {
        return this.hasClosed;
    }
    public isCurrentConnection(socket : WebSocket) : boolean {
        return socket === this.connection;
    }
    public sendMessage(message : OutboundMessages) : void {
        this.getConnection().send(JSON.stringify(message));
    }


}