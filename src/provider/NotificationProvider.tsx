import {type ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {
    type Notification,
    NotificationContext,
    type NotificationType,
} from "../data/NotificationContext.ts";

const DURATION_MS: number = 4000;
const EXIT_MS: number = 300;

const TYPE_STYLES: Record<NotificationType, string> = {
    info: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-amber-500 text-black",
    error: "bg-red-600 text-white",
};

export function NotificationProvider({children}: { children: ReactNode }): React.JSX.Element {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const nextId = useRef<number>(0);

    const dismiss = useCallback((id: number) => {
        setNotifications((current) => current.filter((n) => n.id !== id));
    }, []);

    const push = useCallback((message: string, type: NotificationType = "info") => {
        const id = nextId.current++;
        setNotifications((current) => [...current, {id, message, type}]);
    }, []);

    return (
        <NotificationContext.Provider value={{notifications, push, dismiss}}>
            {children}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pt-4 w-full max-w-md pointer-events-none">
                {notifications.map((notification) => (
                    <Toast key={notification.id} notification={notification} onDismiss={dismiss}/>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

function Toast({notification, onDismiss}: { notification: Notification; onDismiss: (id: number) => void }) {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        // Slide in on the next frame so the transition runs.
        const enter = requestAnimationFrame(() => setVisible(true));
        const timeout = setTimeout(() => setVisible(false), DURATION_MS);
        const remove = setTimeout(() => onDismiss(notification.id), DURATION_MS + EXIT_MS);
        return () => {
            cancelAnimationFrame(enter);
            clearTimeout(timeout);
            clearTimeout(remove);
        };
    }, [notification.id, onDismiss]);

    const close = () => {
        setVisible(false);
        setTimeout(() => onDismiss(notification.id), EXIT_MS);
    };

    return (
        <div
            onClick={close}
            className={`pointer-events-auto cursor-pointer w-full rounded-lg shadow-lg px-4 py-3 flex items-center justify-between gap-3 transition-all duration-300 ease-out ${TYPE_STYLES[notification.type]}`}
            style={{
                transform: visible ? "translateY(0)" : "translateY(-140%)",
                opacity: visible ? 1 : 0,
            }}
        >
            <span className="text-sm font-medium break-words">{notification.message}</span>
            <span className="text-lg leading-none opacity-70">×</span>
        </div>
    );
}
