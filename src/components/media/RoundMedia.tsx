import {useEffect, useRef, useState} from "react";
import {Slider} from "radix-ui";
import "../../App.css";
import {getTikTokStreamUrl} from "../../data/ServerConfig.ts";
import type {
    DistinctionType,
    InstagramMediaType,
    MediaItem,
    MissingMediaItem,
    StringMediaItem,
    TikTokSlideshowItem,
    TikTokVideoItem,
} from "../../socket/Protocol.ts";
import {MediaCarousel} from "./MediaCarousel.tsx";

const iconStyle = {fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"} as const;

type AudioState = {
    muted: boolean;
    volume: number; // 0..1
    onToggleMute: () => void;
    onVolumeChange: (v: number) => void;
};

// ---- Shared controls: mute button + volume slider ----

function AudioControls({muted, volume, onToggleMute, onVolumeChange}: AudioState) {
    return (
        <div className="media-controls">
            <button className="control-btn" style={iconStyle} onClick={onToggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}>
                {muted || volume === 0 ? "volume_off" : "volume_up"}
            </button>
            <Slider.Root
                className="volume-slider"
                min={0}
                max={1}
                step={0.01}
                value={[muted ? 0 : volume]}
                onValueChange={([v]) => onVolumeChange(v)}
                aria-label="Volume"
            >
                <Slider.Track className="volume-slider-track">
                    <Slider.Range className="volume-slider-range"/>
                </Slider.Track>
                <Slider.Thumb className="volume-slider-thumb"/>
            </Slider.Root>
        </div>
    );
}

function VideoStage({src, muted, volume, active, crossOrigin}: {
    src: string;
    muted: boolean;
    volume: number;
    active: boolean;
    crossOrigin?: "use-credentials" | "anonymous";
}) {
    const ref = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Play/pause on active changes, and re-trigger play when unmuting.
    useEffect(() => {
        const video = ref.current;
        if (!video) return;
        if (active) {
            void video.play().catch(() => { /* autoplay may be deferred; muted autoplay is allowed */ });
        } else {
            video.pause();
        }
    }, [active, muted]);

    // volume is a property, not an attribute — set it imperatively.
    useEffect(() => {
        if (ref.current) ref.current.volume = volume;
    }, [volume]);

    return (
        <div className="media-fill">
            <video
                ref={ref}
                className="media-el"
                src={src}
                muted={muted}
                autoPlay
                loop
                playsInline
                crossOrigin={crossOrigin}
                onError={() => setError("Video failed to load")}
                onLoadedData={() => setError(null)}
            />
            {error && (
                <div className="media-error">
                    <span style={iconStyle} className="text-4xl">error</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

function AudioTrack({src, muted, volume}: { src: string; muted: boolean; volume: number }) {
    const ref = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        if (ref.current) ref.current.volume = volume;
    }, [volume]);
    return <audio ref={ref} src={src} autoPlay loop muted={muted}/>;
}

// ---- Per-type renderers ----

type RendererProps<T extends MediaItem> = { item: T } & AudioState;

function InstagramMixedView({item, ...audio}: RendererProps<InstagramMediaType>) {
    const entries = item.entries ?? [];
    return (
        <MediaCarousel
            count={entries.length}
            renderPage={(i, active) => {
                const entry = entries[i];
                if (entry.type === "IMAGE") {
                    return <img className="media-el" src={entry.url} alt=""/>;
                }
                return (
                    <>
                        <VideoStage src={entry.url} muted={audio.muted} volume={audio.volume} active={active}/>
                        <AudioControls {...audio}/>
                    </>
                );
            }}
        />
    );
}

function TikTokSlideshowView({item, ...audio}: RendererProps<TikTokSlideshowItem>) {
    const images = item.imageUrls ?? [];
    return (
        <>
            <MediaCarousel
                count={images.length}
                renderPage={(i) => <img className="media-el" src={images[i]} alt=""/>}
            />
            {/* One looping audio track for the whole slideshow, independent of the image index. */}
            {item.audioUrl && <AudioTrack src={item.audioUrl} muted={audio.muted} volume={audio.volume}/>}
            {item.audioUrl && <AudioControls {...audio}/>}
        </>
    );
}

function TikTokVideoView({item, ...audio}: RendererProps<TikTokVideoItem>) {
    // TikTok videos stream through the backend proxy; the session cookie authorizes the request.
    const src = getTikTokStreamUrl(item.roomId, item.postId);
    return (
        <>
            <VideoStage src={src} muted={audio.muted} volume={audio.volume} active crossOrigin="use-credentials"/>
            <AudioControls {...audio}/>
        </>
    );
}

function StringMediaItemView({item}: RendererProps<StringMediaItem>) {
    return (
        <div className="media-text">
            <span className="media-text-caption">{item.platform}</span>
            <span className="media-text-quote">“{item.stringMedia}”</span>
        </div>
    );
}

function MissingMediaItemView({item}: RendererProps<MissingMediaItem>) {
    return (
        <div className="media-text">
            <span className="media-text-caption">{item.platform}</span>
            <span className="media-text-missing">This content couldn’t be resolved.</span>
        </div>
    );
}

// ---- Dispatch registry ----
// Mapped type: every DistinctionType must have a renderer, or this is a compile error.
const MEDIA_RENDERERS: {
    [K in DistinctionType]: React.FC<RendererProps<Extract<MediaItem, { distinctionType: K }>>>;
} = {
    instagram_mixed_media: InstagramMixedView,
    tiktok_slide_show_media: TikTokSlideshowView,
    tiktok_video_media: TikTokVideoView,
    string_media_item: StringMediaItemView,
    missing_media: MissingMediaItemView,
};

export function RoundMedia({item}: { item: MediaItem }): React.JSX.Element {
    const [muted, setMuted] = useState<boolean>(true);
    const [volume, setVolume] = useState<number>(1);

    const audio: AudioState = {
        muted,
        volume,
        onToggleMute: () => setMuted((m) => !m),
        // Dragging the slider sets the level and unmutes (a gesture that also satisfies autoplay-with-sound).
        onVolumeChange: (v) => {
            setVolume(v);
            setMuted(v === 0);
        },
    };

    const Renderer = MEDIA_RENDERERS[item.distinctionType] as React.FC<RendererProps<MediaItem>>;
    return (
        <div className="media-stage">
            <Renderer item={item} {...audio}/>
        </div>
    );
}
