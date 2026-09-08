import {type ReactNode, useEffect, useRef, useState} from "react";
import "../data/ServerConfig.ts";
import {getLoginUrl, getRegisterUrl, getServerUrl, loadServerUrl} from "../data/ServerConfig.ts";
import {AuthContext, type LoginPayload, type RegisterPayload} from "../data/AuthContext.ts";


const TIMEOUT_MS : number = 8000;


export function AuthProvider({ children }: { children: ReactNode }) : React.JSX.Element {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const autoLoginController = useRef<AbortController | null>(null);

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
            const response =await fetch(getLoginUrl())
            if(response.ok) {
                setIsLoggedIn(true);
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            }
        )
        if(response.ok) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
        setIsLoggingIn(false);
    }
    const logOut = async () => {
        setIsLoggedIn(false);
    }
    const register = async (payload : RegisterPayload) => {
        setIsLoggingIn(true);
        const response = await fetch(getRegisterUrl(), {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
        if(response.ok) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
        setIsLoggingIn(false);
    }

    return (<AuthContext.Provider value = {{isLoggedIn, isLoggingIn, logIn, logOut, register}}>
        {children}
    </AuthContext.Provider>)
}

