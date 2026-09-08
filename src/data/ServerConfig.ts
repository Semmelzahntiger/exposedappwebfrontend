let serverUrl : string = "";

export function setServerUrl (newServerUrl : string) {
    serverUrl = newServerUrl;
    localStorage.setItem("serverUrl", serverUrl);
}
export function getServerUrl() {
    return serverUrl;
}
export function loadServerUrl() {
    const url = localStorage.getItem("serverUrl");
    if (url) {
        setServerUrl(url);
    }
    else {
        setServerUrl("");
    }
}
export function getWebSocketUrl() {
    return getServerUrl() + "/game";
}

export function getAuthUrl() {
    return getServerUrl() + "/api/auth";
}
export function getDataUrl() {
    return getServerUrl() + "/api/data";
}
export function getUploadUrl() {
    return getDataUrl() + "/upload";
}
export function getDeleteUrl() {
    return getDataUrl() + "/delete";
}

export function getLoginUrl() {
    return getAuthUrl() + "/login";
}
export function getRegisterUrl() {
    return getAuthUrl() + "/register";
}
export function getRefreshAccessTokenUrl() {
    return getAuthUrl() + "/get-access-token";
}
export function getTikTokStreamUrl(roomId: string, postId: string) {
    return getServerUrl() + "/stream/tiktok/" + roomId + "/" + postId;
}

// OAuth

export function getTikTokOAuthUrl() {
    return getAuthUrl() + "/tiktok/login";
}
