import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Checkbox, Dialog} from "radix-ui";
import GradientBorder from "react-gradient-borders";
import "../App.css";
import {useNotification} from "../data/NotificationContext.ts";
import type {RoomPlayerRole, UpdateRoomStateMessage} from "../socket/Protocol.ts";

const iconStyle = {fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"} as const;

// Border colors — own is prioritized over host.
const OWN_COLOR = "#22c55e";   // green
const HOST_COLOR = "#ef4444";  // red
const DEFAULT_COLOR = "#b9a7ff"; // purple

function borderColorFor(player: RoomPlayerRole, ownUUID: string): string {
    if (player.playerUUID === ownUUID) return OWN_COLOR;
    if (player.isHost) return HOST_COLOR;
    return DEFAULT_COLOR;
}

function roleLabel(player: RoomPlayerRole, ownUUID: string): string {
    const own = player.playerUUID === ownUUID;
    if (own && player.isHost) return "You · Host";
    if (own) return "You";
    if (player.isHost) return "Host";
    return "";
}

const RESOURCES = ["Liked", "Saved", "Reposted", "Searched", "Commented"] as const;

// ---- Mock room state, shaped like UpdateRoomStateMessage. Replace with live socket data. ----
const MOCK_ROOM: UpdateRoomStateMessage = {
    type: "update_room_state",
    roomCode: "X7K2P",
    hostIsReceiver: true,
    ownUUID: "11111111-1111-1111-1111-111111111111",
    players: [
        {playerUUID: "11111111-1111-1111-1111-111111111111", username: "you_are_host", isHost: true},
        {playerUUID: "22222222-2222-2222-2222-222222222222", username: "alice", isHost: false},
        {playerUUID: "33333333-3333-3333-3333-333333333333", username: "bob", isHost: false},
        {playerUUID: "44444444-4444-4444-4444-444444444444", username: "charlie", isHost: false},
    ],
    settings: {
        roomSize: 8,
        rounds: 10,
        roundTimeInSeconds: 30,
        enabledPlatforms: ["tiktok", "instagram"],
        enabledResources: ["liked", "saved", "reposted", "searched", "commented"],
        beforeDate: "2025-01-01",
    },
};

function CheckboxRow({label, checked, onChange}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="checkbox-label">
            <Checkbox.Root className="checkbox-root" checked={checked}
                           onCheckedChange={(value) => onChange(value === true)}>
                <Checkbox.Indicator className="checkbox-indicator">
                    <span style={iconStyle}>check</span>
                </Checkbox.Indicator>
            </Checkbox.Root>
            {label}
        </label>
    );
}

export function Room(): React.JSX.Element {
    const navigate = useNavigate();
    const {push} = useNotification();

    // Room state (mock for now).
    const [room] = useState<UpdateRoomStateMessage>(MOCK_ROOM);
    const isHost = room.hostIsReceiver;
    const ownUUID = room.ownUUID;

    // Settings checkboxes — default everything on.
    const [platforms, setPlatforms] = useState({tiktok: true, instagram: true});
    const [resources, setResources] = useState<Record<string, boolean>>(
        Object.fromEntries(RESOURCES.map((r) => [r.toLowerCase(), true]))
    );

    // Which user's detail modal is open.
    const [selected, setSelected] = useState<RoomPlayerRole | null>(null);

    return (
        <div className="relative left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 flex flex-row gap-4 items-stretch">
            {/* ---- Main box: players ---- */}
            <GradientBorder colors={["#8b6dff", "#b9a7ff"]}
                            animate={false} strokeWidth={3} borderRadius={25} segments={500}
                            startPosition={"bottom"} lineCapStart={"round"} lineCapEnd={"round"}>
                <div className="app-box flex flex-col gap-4 p-6 w-[55vw] h-[75vh]">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <label className="text-2xl">Room</label>
                            <span className="text-sm text-[var(--text-muted)]">Code: {room.roomCode}</span>
                        </div>
                        <button className="btn" onClick={() => navigate("/menu")}>Leave Room</button>
                    </div>

                    <span className="text-sm text-[var(--text-muted)]">Players ({room.players.length})</span>
                    <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                        {room.players.map((player) => (
                            <button
                                key={player.playerUUID}
                                className="user-entry"
                                style={{borderColor: borderColorFor(player, ownUUID)}}
                                onClick={() => setSelected(player)}
                            >
                                <span className="break-all">{player.username}</span>
                                {roleLabel(player, ownUUID) && (
                                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                                        {roleLabel(player, ownUUID)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-auto">
                        <button
                            className="btn"
                            disabled={!isHost}
                            title={isHost ? "" : "Only the host can start the game"}
                            onClick={() => navigate("/game")}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            </GradientBorder>

            {/* ---- Sidebox: room settings ---- */}
            <GradientBorder colors={["#8b6dff", "#b9a7ff"]}
                            animate={false} strokeWidth={3} borderRadius={25} segments={500}
                            startPosition={"bottom"} lineCapStart={"round"} lineCapEnd={"round"}>
                <div className="app-box flex flex-col gap-5 p-6 w-[20vw] h-[75vh]">
                    <label className="text-2xl">Settings</label>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[var(--text-muted)]">Platforms</span>
                        <CheckboxRow label="TikTok" checked={platforms.tiktok}
                                     onChange={(v) => setPlatforms((p) => ({...p, tiktok: v}))}/>
                        <CheckboxRow label="Instagram" checked={platforms.instagram}
                                     onChange={(v) => setPlatforms((p) => ({...p, instagram: v}))}/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[var(--text-muted)]">Resources</span>
                        {RESOURCES.map((resource) => {
                            const key = resource.toLowerCase();
                            return (
                                <CheckboxRow key={key} label={resource} checked={resources[key]}
                                             onChange={(v) => setResources((r) => ({...r, [key]: v}))}/>
                            );
                        })}
                    </div>
                </div>
            </GradientBorder>

            {/* ---- User detail modal ---- */}
            <Dialog.Root open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay"/>
                    <Dialog.Content className="dialog-content">
                        <Dialog.Title className="text-xl break-all">{selected?.username}</Dialog.Title>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-[var(--text-muted)]">UUID</span>
                            <span className="break-all text-[var(--text)]">{selected?.playerUUID}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                            {/* Host-only actions on another player. Not wired to the backend yet. */}
                            {isHost && selected && selected.playerUUID !== ownUUID && (
                                <>
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            push(`Promoted ${selected.username} to host (not wired yet)`, "info");
                                            setSelected(null);
                                        }}
                                    >
                                        Promote to host
                                    </button>
                                    <button
                                        className="btn"
                                        style={{
                                            backgroundImage: "linear-gradient(var(--surface-3), var(--surface-3)), linear-gradient(135deg, #ef4444, #f87171)",
                                        }}
                                        onClick={() => {
                                            push(`Kicked ${selected.username} (not wired yet)`, "warning");
                                            setSelected(null);
                                        }}
                                    >
                                        Kick
                                    </button>
                                </>
                            )}
                            <Dialog.Close asChild>
                                <button className="btn">Close</button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
