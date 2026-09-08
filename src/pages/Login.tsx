import {useNavigate} from "react-router-dom";
import {useNotification} from "../data/NotificationContext.ts";

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
                <label style={{color: "#FFFFFF"}} className="relative -top-5 text-2xl">Login</label>
            </div>
            <div className="flex flex-col gap-1 items-center w-9/10 justify-center bg-oklch(13% 0.028 261.692) rounded-box p-1">
                <input id="email" type="email" placeholder="Email" style={{color: "#FFFFFF"}} className="w-full h-10"/>
            </div>
            <div className="flex flex-col gap-1 items-center w-9/10 justify-center bg-oklch(13% 0.028 261.692) rounded-box p-1">
                <input id="password" type="password" placeholder="Password" style={{color: "#FFFFFF"}} className="w-full h-10"/>
            </div>
            <div className="relative left-3/7 top-5 -translate-x-1/2  bg-amber-50 rounded p-1">
                <button style={{color: "#000000"}} onClick={() => {
                    push("Login pressed", "info")
                    navigate("/menu")
                }}>
                    Login
                </button>
            </div>
            <div className="relative top-8 flex gap-2">
                <button style={{color: "#000000"}} className="bg-blue-400 rounded p-1"
                        onClick={() => push("This is an info message", "info")}>
                    info
                </button>
                <button style={{color: "#000000"}} className="bg-green-400 rounded p-1"
                        onClick={() => push("Saved successfully!", "success")}>
                    success
                </button>
                <button style={{color: "#000000"}} className="bg-amber-400 rounded p-1"
                        onClick={() => push("Heads up, warning!", "warning")}>
                    warning
                </button>
                <button style={{color: "#000000"}} className="bg-red-400 rounded p-1"
                        onClick={() => push("Something went wrong", "error")}>
                    error
                </button>
            </div>
        </div>
    )
}
