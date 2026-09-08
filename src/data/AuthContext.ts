import {type Context, createContext, useContext} from "react";

export type LoginPayload = {
    email: string;
    password: string;
}
export type RegisterPayload = {
    email: string;
    username: string;
    password: string;
}

export type AuthValue = {
    isLoggedIn: boolean
    isLoggingIn: boolean
    logIn: (payload : LoginPayload) => Promise<void>
    logOut: () => Promise<void>
    register: (payload : RegisterPayload) => Promise<void>
}

export const AuthContext : Context<AuthValue | null> = createContext<AuthValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be used within the AuthProvider");
    return ctx;
}