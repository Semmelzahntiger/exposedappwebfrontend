import type {DistinctionType, MediaItem} from "../../socket/Protocol.ts";

// ---- DEV FIXTURES ONLY ----
// Public sample URLs so the renderer is visually testable without a backend.
// Not used in production — replace with live NextRoundMessage.mediaItem.

const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const img = (seed: string) => `https://picsum.photos/seed/${seed}/1080/1920`;

export const PREVIEW_ITEMS: Record<DistinctionType, MediaItem> = {
    instagram_mixed_media: {
        platform: "instagram",
        type: "MIXED",
        distinctionType: "instagram_mixed_media",
        entries: [
            {type: "IMAGE", url: img("ig1")},
            {type: "VIDEO", url: SAMPLE_VIDEO},
            {type: "IMAGE", url: img("ig2")},
        ],
    },
    tiktok_slide_show_media: {
        platform: "tiktok",
        type: "IMAGE",
        distinctionType: "tiktok_slide_show_media",
        imageUrls: [img("ss1"), img("ss2"), img("ss3")],
        audioUrl: SAMPLE_AUDIO,
    },
    tiktok_video_media: {
        platform: "tiktok",
        type: "VIDEO",
        distinctionType: "tiktok_video_media",
        // Resolves via getTikTokStreamUrl; needs the live backend/proxy to actually play.
        roomId: "DEV_ROOM",
        postId: "DEV_POST",
    },
    string_media_item: {
        platform: "tiktok",
        type: "TEXT",
        distinctionType: "string_media_item",
        stringMedia: "when you finally understand the media renderer dispatch",
    },
    missing_media: {
        platform: "instagram",
        type: "NONE",
        distinctionType: "missing_media",
    },
};
