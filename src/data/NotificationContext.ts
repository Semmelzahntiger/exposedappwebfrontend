import {type Context, createContext, useContext} from "react";

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
    id: number;
    message: string;
    type: NotificationType;
};

export type NotificationValue = {
    notifications: Notification[];
    push: (message: string, type?: NotificationType) => void;
    dismiss: (id: number) => void;
};

export const NotificationContext: Context<NotificationValue | null> = createContext<NotificationValue | null>(null);

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be used within the NotificationProvider");
    return ctx;
}
