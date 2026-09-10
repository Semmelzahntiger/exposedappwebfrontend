import {useNavigate} from "react-router-dom";
import {useNotification} from "../data/NotificationContext.ts";
import "../App.css";
import {useState} from "react";
import {useAuth} from "../data/AuthContext.ts";
import {LoadingCircle} from "../components/LoadingCircle.tsx";
import {validateEmail, validatePassword, validateUsername} from "../data/validation.ts";

export function Register() {
    const {push} = useNotification();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();

    return (
        <div id="app"
             className="flex flex-col
              gap-1 items-center
               justify-center
               min-h-[40vh] max-h-[50vh] max-w-[25vw]
                relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                ">
            {loading && <LoadingCircle/>}
            <div>
                <label className="relative -top-5 text-2xl text-[var(--text)]">Register</label>
            </div>
            <div className="widget flex flex-col gap-1 items-center w-9/10 justify-center p-1">
                <input id="email" type="email" placeholder="Email"
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full h-10 bg-transparent text-[var(--text)] outline-none px-2"/>
            </div>
            <div className="widget flex flex-col gap-1 items-center w-9/10 justify-center p-1">
                <input id="username" type="text" placeholder="Username"
                       onChange={(e) => setUsername(e.target.value)}
                       className="w-full h-10 bg-transparent text-[var(--text)] outline-none px-2"/>
            </div>
            <div className="widget flex flex-col gap-1 items-center w-9/10 justify-center p-1">
                <input id="password" type="password" placeholder="Password"
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full h-10 bg-transparent text-[var(--text)] outline-none px-2"/>
            </div>
            <div className="relative left-3/7 top-5 -translate-x-1/2">
                <button className="btn" onClick={async () => {
                    const error = validateEmail(email) ?? validateUsername(username) ?? validatePassword(password);
                    if (error) {
                        push(error, "error");
                        return;
                    }
                    setLoading(true);
                    const redirect = await register({email: email.trim(), username: username.trim(), password});
                    if (redirect) {
                        navigate("/menu");
                    }
                    setLoading(false);
                }}>
                    Register
                </button>
            </div>
            <div className="relative top-8">
                <button className="text-sm text-[var(--text-muted)] underline" onClick={() => navigate("/login")}>
                    Back to login
                </button>
            </div>
        </div>
    )
}
