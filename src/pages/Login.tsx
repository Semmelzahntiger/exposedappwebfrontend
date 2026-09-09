import {useNavigate} from "react-router-dom";
import {useNotification} from "../data/NotificationContext.ts";
import "../App.css";

export default function Login() {
    const {push} = useNotification();
    const navigate = useNavigate();

    return (
        <div id="app"
             className="flex flex-col
              gap-1 items-center
               justify-center
               min-h-[40vh] max-h-[50vh] max-w-[25vw]
                relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                ">
            <div>
                <label className="relative -top-5 text-2xl text-[var(--text)]">Login</label>
            </div>
            <div className="widget flex flex-col gap-1 items-center w-9/10 justify-center p-1">
                <input id="email" type="email" placeholder="Email"
                       className="w-full h-10 bg-transparent text-[var(--text)] outline-none px-2"/>
            </div>
            <div className="widget flex flex-col gap-1 items-center w-9/10 justify-center p-1">
                <input id="password" type="password" placeholder="Password"
                       className="w-full h-10 bg-transparent text-[var(--text)] outline-none px-2"/>
            </div>
            <div className="relative left-3/7 top-5 -translate-x-1/2">
                <button className="btn" onClick={() => {
                    push("Login pressed", "info")
                    navigate("/menu")
                }}>
                    Login
                </button>
            </div>
            <div className="relative top-8 flex gap-2">
                <button className="widget border-2 border-blue-400 text-[var(--text)] px-3 py-1"
                        onClick={() => push("This is an info message", "info")}>
                    info
                </button>
                <button className="widget border-2 border-green-400 text-[var(--text)] px-3 py-1"
                        onClick={() => push("Saved successfully!", "success")}>
                    success
                </button>
                <button className="widget border-2 border-amber-400 text-[var(--text)] px-3 py-1"
                        onClick={() => push("Heads up, warning!", "warning")}>
                    warning
                </button>
                <button className="widget border-2 border-red-400 text-[var(--text)] px-3 py-1"
                        onClick={() => push("Something went wrong", "error")}>
                    error
                </button>
            </div>
        </div>
    )
}
