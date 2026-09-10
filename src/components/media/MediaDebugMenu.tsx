import {useState} from "react";
import {Dialog} from "radix-ui";
import "../../App.css";
import type {
    DistinctionType,
    InstagramCDNEntry,
    MediaItem,
    SocialMediaPlatform,
} from "../../socket/Protocol.ts";
import {PREVIEW_ITEMS} from "./mockMedia.ts";

const TYPE_LABELS: Record<DistinctionType, string> = {
    instagram_mixed_media: "Instagram (mixed)",
    tiktok_slide_show_media: "TikTok slideshow",
    tiktok_video_media: "TikTok video",
    string_media_item: "String",
    missing_media: "Missing",
};
const TYPES = Object.keys(TYPE_LABELS) as DistinctionType[];

const inputClass = "widget w-full px-2 py-1 bg-[var(--surface-2)] text-[var(--text)] outline-none";

// Pull the sample fixtures apart so each field can be prefilled sensibly.
const igSample = PREVIEW_ITEMS.instagram_mixed_media as Extract<MediaItem, { distinctionType: "instagram_mixed_media" }>;
const ssSample = PREVIEW_ITEMS.tiktok_slide_show_media as Extract<MediaItem, { distinctionType: "tiktok_slide_show_media" }>;
const tvSample = PREVIEW_ITEMS.tiktok_video_media as Extract<MediaItem, { distinctionType: "tiktok_video_media" }>;
const strSample = PREVIEW_ITEMS.string_media_item as Extract<MediaItem, { distinctionType: "string_media_item" }>;

export function MediaDebugMenu({onApply}: { onApply: (item: MediaItem) => void }): React.JSX.Element {
    const [open, setOpen] = useState(false);

    const [type, setType] = useState<DistinctionType>("instagram_mixed_media");
    const [platform, setPlatform] = useState<SocialMediaPlatform>("tiktok");

    // Per-type field state (each keeps its own values across type switches).
    const [entries, setEntries] = useState<InstagramCDNEntry[]>(igSample.entries.map((e) => ({...e})));
    const [imageUrls, setImageUrls] = useState<string[]>([...ssSample.imageUrls]);
    const [audioUrl, setAudioUrl] = useState<string>(ssSample.audioUrl);
    const [roomId, setRoomId] = useState<string>(tvSample.roomId);
    const [postId, setPostId] = useState<string>(tvSample.postId);
    const [stringMedia, setStringMedia] = useState<string>(strSample.stringMedia);

    const build = (): MediaItem => {
        switch (type) {
            case "instagram_mixed_media":
                return {platform, type: "MIXED", distinctionType: type, entries};
            case "tiktok_slide_show_media":
                return {platform, type: "IMAGE", distinctionType: type, imageUrls, audioUrl};
            case "tiktok_video_media":
                return {platform, type: "VIDEO", distinctionType: type, roomId, postId};
            case "string_media_item":
                return {platform, type: "TEXT", distinctionType: type, stringMedia};
            case "missing_media":
                return {platform, type: "NONE", distinctionType: type};
        }
    };

    const apply = () => {
        onApply(build());
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="btn">Debug</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay"/>
                <Dialog.Content className="dialog-content" style={{maxWidth: 520, width: "90vw", maxHeight: "85vh", overflowY: "auto"}}>
                    <Dialog.Title className="text-xl">Media debug</Dialog.Title>

                    {/* Type selector */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-[var(--text-muted)]">Type</span>
                        <div className="flex flex-wrap gap-1">
                            {TYPES.map((t) => (
                                <button key={t} className="btn text-xs" style={{opacity: t === type ? 1 : 0.5}}
                                        onClick={() => setType(t)}>
                                    {TYPE_LABELS[t]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform (affects string/missing captions and is carried on every item) */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-[var(--text-muted)]">Platform</span>
                        <div className="flex gap-2">
                            {(["tiktok", "instagram"] as SocialMediaPlatform[]).map((p) => (
                                <button key={p} className="btn text-sm" style={{opacity: p === platform ? 1 : 0.5}}
                                        onClick={() => setPlatform(p)}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type-specific fields */}
                    {type === "instagram_mixed_media" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[var(--text-muted)]">Entries (image or video)</span>
                            {entries.map((entry, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <button
                                        className="btn text-xs whitespace-nowrap"
                                        onClick={() => setEntries((prev) => prev.map((e, j) =>
                                            j === i ? {...e, type: e.type === "IMAGE" ? "VIDEO" : "IMAGE"} : e))}
                                    >
                                        {entry.type === "IMAGE" ? "IMAGE" : "VIDEO"}
                                    </button>
                                    <input className={inputClass} value={entry.url} placeholder="URL"
                                           onChange={(ev) => setEntries((prev) => prev.map((e, j) =>
                                               j === i ? {...e, url: ev.target.value} : e))}/>
                                    <button className="btn text-xs" onClick={() => setEntries((prev) => prev.filter((_, j) => j !== i))}>−</button>
                                </div>
                            ))}
                            <button className="btn text-sm w-fit"
                                    onClick={() => setEntries((prev) => [...prev, {type: "IMAGE", url: ""}])}>
                                + Add entry
                            </button>
                        </div>
                    )}

                    {type === "tiktok_slide_show_media" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[var(--text-muted)]">Image URLs</span>
                            {imageUrls.map((url, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input className={inputClass} value={url} placeholder="Image URL"
                                           onChange={(ev) => setImageUrls((prev) => prev.map((u, j) => j === i ? ev.target.value : u))}/>
                                    <button className="btn text-xs" onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}>−</button>
                                </div>
                            ))}
                            <button className="btn text-sm w-fit" onClick={() => setImageUrls((prev) => [...prev, ""])}>+ Add image</button>
                            <span className="text-sm text-[var(--text-muted)] mt-1">Audio URL</span>
                            <input className={inputClass} value={audioUrl} placeholder="Audio URL"
                                   onChange={(ev) => setAudioUrl(ev.target.value)}/>
                        </div>
                    )}

                    {type === "tiktok_video_media" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-[var(--text-muted)]">Streams via getTikTokStreamUrl(roomId, postId) — needs the live backend to play.</span>
                            <span className="text-sm text-[var(--text-muted)]">Room ID</span>
                            <input className={inputClass} value={roomId} onChange={(ev) => setRoomId(ev.target.value)}/>
                            <span className="text-sm text-[var(--text-muted)]">Post ID</span>
                            <input className={inputClass} value={postId} onChange={(ev) => setPostId(ev.target.value)}/>
                        </div>
                    )}

                    {type === "string_media_item" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[var(--text-muted)]">Text</span>
                            <textarea className={inputClass} rows={3} value={stringMedia}
                                      onChange={(ev) => setStringMedia(ev.target.value)}/>
                        </div>
                    )}

                    {type === "missing_media" && (
                        <span className="text-sm text-[var(--text-muted)]">No inputs — shows the fallback for the chosen platform.</span>
                    )}

                    <div className="flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <button className="btn">Cancel</button>
                        </Dialog.Close>
                        <button className="btn" onClick={apply}>Apply</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
