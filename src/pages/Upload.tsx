import {type DragEvent, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {RadioGroup} from "radix-ui";
import GradientBorder from "react-gradient-borders";
import "../App.css";
import {useNotification} from "../data/NotificationContext.ts";
import {getUploadUrl} from "../data/ServerConfig.ts";
import {LoadingCircle} from "../components/LoadingCircle.tsx";

type Platform = "tiktok" | "instagram";

const iconStyle = {fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"} as const;

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Returns an error message if the file is not an accepted upload, or null if it's fine.
function validateFile(file: File): string | null {
    const isZip = file.name.toLowerCase().endsWith(".zip") ||
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed";
    if (!isZip) return "Only .zip files are allowed";
    if (file.size > MAX_BYTES) return `File is too large (${formatSize(file.size)}). Max is 200 MB`;
    return null;
}

export function Upload(): React.JSX.Element {
    const navigate = useNavigate();
    const {push} = useNotification();

    const [platform, setPlatform] = useState<Platform>("tiktok");
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Single entry point for both drop and browse — validates before accepting.
    const selectFile = (candidate: File | null | undefined) => {
        if (!candidate) return;
        const error = validateFile(candidate);
        if (error) {
            push(error, "error");
            return;
        }
        setFile(candidate);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        selectFile(e.dataTransfer.files?.[0]);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const upload = async () => {
        if (!file) {
            push("Please select a file first", "warning");
            return;
        }
        const form = new FormData();
        form.append("file", file);
        form.append("declaredFileType", platform);

        setUploading(true);
        try {
            const response = await fetch(getUploadUrl(), {method: "POST", body: form, credentials: "include"});
            if (response.ok) {
                push("Upload successful!", "success");
                setFile(null);
            } else {
                const {error} = await response.json();
                push(`Upload failed. Server: ${error}`, "error");
            }
        } catch {
            push("Could not reach the server", "error");
        } finally {
            setUploading(false);
        }
    };

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
            <div className="app-box relative flex flex-col gap-4 items-stretch justify-start p-6 w-[40vw] h-[70vh]">
                {uploading && <LoadingCircle/>}
                <div className="flex items-center justify-between">
                    <label className="text-2xl">Upload</label>
                    <button style={iconStyle} className="btn min-w-1/10" onClick={() => navigate("/settings")}>
                        <span style={iconStyle}>close</span>
                    </button>
                </div>

                {/* Platform selector */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-[var(--text-muted)]">Platform</label>
                    <RadioGroup.Root
                        className="flex flex-row gap-3"
                        value={platform}
                        onValueChange={(value) => setPlatform(value as Platform)}
                    >
                        <RadioGroup.Item value="tiktok" className="radio-item">
                            <span className="radio-control">
                                <RadioGroup.Indicator className="radio-indicator"/>
                            </span>
                            <span>TikTok</span>
                        </RadioGroup.Item>
                        <RadioGroup.Item value="instagram" className="radio-item">
                            <span className="radio-control">
                                <RadioGroup.Indicator className="radio-indicator"/>
                            </span>
                            <span>Instagram</span>
                        </RadioGroup.Item>
                    </RadioGroup.Root>
                </div>

                {/* Drag & drop zone */}
                <div
                    className={`dropzone flex-1 ${dragging ? "dropzone--active" : ""} ${file ? "dropzone--has-file" : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={() => setDragging(false)}
                >
                    <span style={iconStyle} className="text-5xl">
                        {file ? "check_circle" : "cloud_upload"}
                    </span>
                    {file ? (
                        <>
                            <span className="text-[var(--text)] break-all text-center px-4">{file.name}</span>
                            <span className="text-sm text-[var(--text-muted)]">{formatSize(file.size)}</span>
                            <span className="text-xs text-[var(--text-muted)]">Click or drop to replace</span>
                        </>
                    ) : (
                        <>
                            <span>Drag &amp; drop a file here</span>
                            <span className="text-sm">or click to browse</span>
                            <span className="text-xs mt-1">.zip · up to 200 MB</span>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        hidden
                        onChange={(e) => selectFile(e.target.files?.[0])}
                    />
                </div>

                <button className="btn w-full" disabled={!file || uploading} onClick={async () => {
                    await upload();
                }}>
                    {uploading ? "Uploading…" : "Upload"}
                </button>
            </div>
        </GradientBorder>
    );
}
