import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GradientBorder from "react-gradient-borders";
import "../App.css";
import {useNotification} from "../data/NotificationContext.ts";
import {RoundMedia} from "../components/media/RoundMedia.tsx";
import {MediaDebugMenu} from "../components/media/MediaDebugMenu.tsx";
import {PREVIEW_ITEMS} from "../components/media/mockMedia.ts";
import type {MediaItem} from "../socket/Protocol.ts";

const iconStyle = {fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"} as const;

const OWN_COLOR = "#22c55e";     // green
const DEFAULT_COLOR = "#b9a7ff"; // purple

// ---- Mock round info. Replace with live values (settings.rounds, NextRoundMessage.roundTimeInSeconds). ----
const MOCK_ROUND = 1;
const MOCK_TOTAL_ROUNDS = 30;
const MOCK_ROUND_TIME = 30; // seconds

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

type GamePlayer = {
    uuid: string;
    username: string;
    score: number;
};

// ---- Mock game data. Replace with live socket state (players from the room,
//      scores from game_score_state / UpdateGameScoreStateMessage). ----
const MOCK_OWN_UUID = "11111111-1111-1111-1111-111111111111";
const MOCK_PLAYERS: GamePlayer[] = [
    {uuid: "11111111-1111-1111-1111-111111111111", username: "you_are_host", score: 30},
    {uuid: "22222222-2222-2222-2222-222222222222", username: "alice", score: 50},
    {uuid: "33333333-3333-3333-3333-333333333333", username: "bob", score: 20},
    {uuid: "44444444-4444-4444-4444-444444444444", username: "charlie", score: 40},
];

const gradientProps = {
    colors: ["#8b6dff", "#b9a7ff"] as [string, string],
    animate: false,
    strokeWidth: 3,
    borderRadius: 25,
    segments: 500,
    startPosition: "bottom" as const,
    lineCapStart: "round" as const,
    lineCapEnd: "round" as const,
};

export function Game(): React.JSX.Element {
    const navigate = useNavigate();
    const {push} = useNotification();

    const [players] = useState<GamePlayer[]>(MOCK_PLAYERS);
    const ownUUID = MOCK_OWN_UUID;

    // DEV: media item currently shown (built via the debug menu). applyKey forces a remount per Apply.
    const [mediaItem, setMediaItem] = useState<MediaItem>(PREVIEW_ITEMS.instagram_mixed_media);
    const [applyKey, setApplyKey] = useState<number>(0);

    // Round countdown (mock: ticks once from MOCK_ROUND_TIME; reset on next_round when wired).
    const [timeLeft, setTimeLeft] = useState<number>(MOCK_ROUND_TIME);
    useEffect(() => {
        const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);

    // Scoreboard is ranked; players list (guess targets) keeps room order.
    const ranked = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="flex flex-row gap-4 items-center justify-center w-screen h-screen">
            {/* ---- Left box: players as guess buttons (2 columns) ---- */}
            <GradientBorder {...gradientProps}>
                <div className="app-box flex flex-col gap-3 p-5 w-[24vw] h-[90vh]">
                    <label className="text-xl">Players</label>
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1 content-start">
                        {players.map((player) => (
                            <button
                                key={player.uuid}
                                className="btn"
                                onClick={() => push(`Guessed ${player.username} (not wired yet)`, "info")}
                            >
                                <span className="break-all">{player.username}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </GradientBorder>

            {/* ---- Middle box: video player (set up separately) ---- */}
            <GradientBorder {...gradientProps}>
                <div className="app-box flex flex-col gap-3 p-5 w-[34vw] h-[90vh]">
                    <div className="grid grid-cols-3 items-center">
                        <label className="text-xl">Round {MOCK_ROUND}/{MOCK_TOTAL_ROUNDS}</label>
                        <span className="text-xl text-center flex items-center justify-center gap-1">
                            <span style={iconStyle}>timer</span>
                            {formatTime(timeLeft)}
                        </span>
                        <button className="btn justify-self-end" onClick={() => navigate("/menu")}>Leave Game</button>
                    </div>
                    {/* The round media renderer. key forces a fresh remount on each Apply. */}
                    <div className="flex-1 min-h-0">
                        <RoundMedia key={applyKey} item={mediaItem}/>
                    </div>

                    {/* DEV debug menu — remove once next_round is wired to the socket. */}
                    <div className="flex justify-center">
                        <MediaDebugMenu onApply={(item) => {
                            setMediaItem(item);
                            setApplyKey((k) => k + 1);
                        }}/>
                    </div>
                </div>
            </GradientBorder>

            {/* ---- Right box: scoreboard (1 column, own marked green) ---- */}
            <GradientBorder {...gradientProps}>
                <div className="app-box flex flex-col gap-3 p-5 w-[24vw] h-[90vh]">
                    <label className="text-xl">Scoreboard</label>
                    <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                        {ranked.map((player, index) => (
                            <div
                                key={player.uuid}
                                className="user-entry"
                                style={{borderColor: player.uuid === ownUUID ? OWN_COLOR : DEFAULT_COLOR}}
                            >
                                <span className="break-all">
                                    <span className="text-[var(--text-muted)] mr-2">{index + 1}.</span>
                                    {player.username}
                                </span>
                                <span className="whitespace-nowrap">{player.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </GradientBorder>
        </div>
    );
}
