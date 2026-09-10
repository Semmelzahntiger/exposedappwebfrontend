// Client-side validation. The backend is authoritative; these just give fast UX feedback.

// Room codes are 6 chars of uppercase letters + digits (see backend LobbyCodeGenerator).
export const ROOM_CODE_REGEX = /^[A-Z0-9]{6}$/;

/** Uppercase, strip anything that isn't A-Z/0-9, and cap at 6 chars. */
export function sanitizeRoomCode(raw: string): string {
    return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function isValidRoomCode(code: string): boolean {
    return ROOM_CODE_REGEX.test(code);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message, or null if valid. */
export function validateEmail(email: string): string | null {
    return EMAIL_REGEX.test(email.trim()) ? null : "Please enter a valid email address";
}

export function validateUsername(username: string): string | null {
    const trimmed = username.trim();
    if (trimmed.length < 3) return "Username must be at least 3 characters";
    if (trimmed.length > 15) return "Username must be at most 15 characters";
    return null;
}

export function validatePassword(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
}
