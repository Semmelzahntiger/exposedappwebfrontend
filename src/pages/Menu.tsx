import "../App.css";
import GradientBorder from "react-gradient-borders";
import {useNavigate} from "react-router-dom";
import {Dialog} from "radix-ui";
import {useEffect, useState} from "react";
import {getLogoutUrl} from "../data/ServerConfig.ts";
import {useConnectionState} from "../data/WebSocketContext.ts";
import {useNotification} from "../data/NotificationContext.ts";
import {isValidRoomCode, sanitizeRoomCode} from "../data/validation.ts";
import {addListener, getConnection} from "../socket/WebSocketConnection.ts";
import {LoadingCircle} from "../components/LoadingCircle.tsx";

export default function Menu() {
    const navigate = useNavigate();
    const connectionState = useConnectionState();
    const {push} = useNotification();
    const [joinOpen, setJoinOpen] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);

    const joinRoom = () => {
        if (!isValidRoomCode(roomCode)) return;
        setLoading(true);
        setJoinOpen(false);
    };

    useEffect(() => {
        const listeners = [
            addListener("confirm_create_room",() => {
                push("Created Room.", "success")
                navigate("/room");
            }),
            addListener("denied_create_room", () => {
                push("Room creation was denied.", "error")
            }),
            addListener("confirm_join_room", () => {
                push("Joined Room.", "success")
                navigate("/room");
            }),
            addListener("denied_join_room", () => {
                push("Couldn't join Room.", "error")
            }),
            addListener("room_not_found", () => {
                push(`Room with code '${roomCode}' not found`, "warning")
            })
        ]
        return () => listeners.forEach(close => close());
    }, [navigate, push])

    return (
        <GradientBorder colors={["#8b6dff", "#b9a7ff"]}
                        animate={false}
                        strokeWidth={3}
                        borderRadius={25}
                        segments={500}
                        startPosition={"bottom"}
                        lineCapStart={"round"}
                        lineCapEnd={"round"}
                        className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {loading && <LoadingCircle/>}
            <div className="app-box
             flex flex-col gap-1 items-center justify-center
             w-[30vw] h-[30vh]
             ">
                <button id="logout" className="btn flex absolute top-1/20 left-1/30 min-h-1/10 min-w-1/10 text-center items-center justify-center"
                        onClick={async() => {
                            await fetch(getLogoutUrl(), {
                                method: "POST",
                                credentials: "include",
                            })
                            await connectionState.disconnect()
                            push("Successfully logged out", "success")
                            navigate("/login");
                        }}
                >Logout</button>
                <button id="settings" className="btn flex absolute top-1/20 right-1/30 min-h-1/10 min-w-1/10 text-center items-center justify-center"
                    onClick={() => {
                        navigate("/settings");
                    }}
                >Settings</button>

                <div className="flex flex-row justify-center gap-6 p-1 relative top-3/10 min-w-9/10 min-h-3/10">
                    <button className="btn flex min-w-1/2 items-center justify-center" onClick={() => {
                        getConnection()?.sendMessage({
                            type:"create_room"
                        });
                    }}>Create Room</button>
                    <button className="btn flex min-w-1/2 items-center justify-center"
                            onClick={() => setJoinOpen(true)}>Join Room</button>
                </div>


            </div>

            {/* Join Room modal */}
            <Dialog.Root open={joinOpen} onOpenChange={setJoinOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay"/>
                    <Dialog.Content className="dialog-content" style={{minWidth: 320}}>
                        <Dialog.Title className="text-xl">Join Room</Dialog.Title>
                        <input
                            autoFocus
                            value={roomCode}
                            onChange={(e) => setRoomCode(sanitizeRoomCode(e.target.value))}
                            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                            placeholder="6-character code"
                            className="widget w-full px-3 py-2 bg-[var(--surface-2)] text-[var(--text)] outline-none tracking-[0.3em] uppercase"
                        />
                        <div className="flex justify-end gap-2">
                            <Dialog.Close asChild>
                                <button className="btn">Cancel</button>
                            </Dialog.Close>
                            <button className="btn" disabled={!isValidRoomCode(roomCode)} onClick={joinRoom}>Join</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </GradientBorder>
    )
}
