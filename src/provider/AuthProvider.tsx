import {type ReactNode, useEffect, useRef, useState} from "react";
import "../data/ServerConfig.ts";
import {
    getLoginUrl,
    getRefreshAccessTokenUrl,
    getRegisterUrl,
    getServerUrl,
    loadServerUrl
} from "../data/ServerConfig.ts";
import {AuthContext, type LoginPayload, type RegisterPayload} from "../data/AuthContext.ts";
import {useNotification} from "../data/NotificationContext.ts";
import {useNavigate} from "react-router-dom";


const TIMEOUT_MS : number = 8000;


export function AuthProvider({ children }: { children: ReactNode }) : React.JSX.Element {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const autoLoginController = useRef<AbortController | null>(null);
    const {push} = useNotification();
    const navigate = useNavigate();
    useEffect(() => {
        const controller = new AbortController();
        autoLoginController.current = controller;
        const timeout = setTimeout(() => {
            controller.abort();
        },TIMEOUT_MS);
        (async () => {
            loadServerUrl();
            const url = getServerUrl();
            if(url === "") {
                return;
            }
            setIsLoggingIn(true);
            const response = await fetch(getRefreshAccessTokenUrl(), {
                body: JSON.stringify({token : null}),
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            })
            if(response.ok) {
                push("Auto Login successful.", "success")
                setIsLoggedIn(true);
                navigate("/menu");
            }
            setIsLoggingIn(false);
        })();
        return () => {
            clearTimeout(timeout);
            controller.abort();
        }
    }, []);

    const logIn = async (payload : LoginPayload) => {
        setIsLoggingIn(true);
        setIsLoggedIn(false);
        const response = await fetch(getLoginUrl(),
            {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            }
        )
        const {error} = await response.json();
        if(response.ok) {
            setIsLoggedIn(true);
            push("Log in successful.", "success")
            setIsLoggingIn(false);
            return true;
        }
        else {
            setIsLoggedIn(false);
            push(`Couldn't log in. ${error} (${response.status})`, "error")
        }
        setIsLoggingIn(false);
        return false;
    }
    const logOut = async () => {
        setIsLoggedIn(false);
    }
    const register = async (payload : RegisterPayload) => {
        setIsLoggingIn(true);
        const response = await fetch(getRegisterUrl(), {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
        if(response.ok) {
            setIsLoggedIn(true);
            setIsLoggingIn(false);
            return true;
        }
        else {
            setIsLoggedIn(false);
        }
        setIsLoggingIn(false);
        return false;
    }

    return (<AuthContext.Provider value = {{isLoggedIn, isLoggingIn, logIn, logOut, register}}>
        {children}
    </AuthContext.Provider>)
}

