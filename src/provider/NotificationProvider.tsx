import {type ReactNode, useCallback, useRef, useState} from "react";
import {Toast} from "radix-ui";
import "../App.css";
import {
    type Notification,
    NotificationContext,
    type NotificationType,
} from "../data/NotificationContext.ts";

const DURATION_MS: number = 4000;
const EXIT_MS: number = 300;

// Gray fill comes from `.toast-root`; type only drives the border color.
// Applied inline so it beats the base `.toast-root` border-color in the cascade.
const TYPE_COLORS: Record<NotificationType, string> = {
    info: "#3b82f6",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
};

type InternalNotification = Notification & { open: boolean };

export function NotificationProvider({children}: { children: ReactNode }): React.JSX.Element {
    const [notifications, setNotifications] = useState<InternalNotification[]>([]);
    const nextId = useRef<number>(0);

    // Start the Radix exit animation (open -> false), then drop it from the list once it finishes.
    const dismiss = useCallback((id: number) => {
        setNotifications((current) => current.map((n) => (n.id === id ? {...n, open: false} : n)));
        setTimeout(() => {
            setNotifications((current) => current.filter((n) => n.id !== id));
        }, EXIT_MS);
    }, []);

    const push = useCallback((message: string, type: NotificationType = "info") => {
        const id = nextId.current++;
        setNotifications((current) => [...current, {id, message, type, open: true}]);
        // Drive auto-dismiss ourselves. Radix's own timer pauses on window blur / hover,
        // which makes toasts linger; our timer fires regardless of focus.
        setTimeout(() => dismiss(id), DURATION_MS);
    }, [dismiss]);

    return (
        <NotificationContext.Provider value={{notifications, push, dismiss}}>
            <Toast.Provider swipeDirection="up" duration={Infinity}>
                {children}
                {notifications.map((notification) => (
                    <Toast.Root
                        key={notification.id}
                        open={notification.open}
                        onOpenChange={(open) => {
                            if (!open) dismiss(notification.id);
                        }}
                        className="toast-root"
                        style={{borderColor: TYPE_COLORS[notification.type]}}
                    >
                        <Toast.Title className="text-sm font-medium break-words">
                            {notification.message}
                        </Toast.Title>
                        <Toast.Close className="text-lg leading-none opacity-70" aria-label="Close">
                            ×
                        </Toast.Close>
                    </Toast.Root>
                ))}
                <Toast.Viewport className="toast-viewport"/>
            </Toast.Provider>
        </NotificationContext.Provider>
    );
}
