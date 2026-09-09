import "../App.css";
import GradientBorder from "react-gradient-borders";

export default function Menu() {
    return (
        <GradientBorder colors={["#8b6dff", "#b9a7ff"]}
                        animate={false}
                        strokeWidth={3}
                        borderRadius={25}
                        segments={500}
                        startPosition={"bottom"}
                        lineCapStart={"round"}
                        lineCapEnd={"round"}
                        className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="app-box
             flex flex-col gap-1 items-center justify-center
             w-[30vw] h-[30vh]
             ">
                <button className="btn flex absolute top-1/20 left-1/30 min-h-1/10 min-w-1/10 text-center items-center justify-center">Logout</button>
                <button id="settings" className="btn flex absolute top-1/20 right-1/30 min-h-1/10 min-w-1/10 text-center items-center justify-center">Settings</button>

                <div className="flex flex-row justify-center gap-6 p-1 relative top-3/10 min-w-9/10 min-h-3/10">
                    <button className="btn flex min-w-1/2 items-center justify-center">Create Room</button>
                    <button className="btn flex min-w-1/2 items-center justify-center">Join Room</button>
                </div>


            </div>
        </GradientBorder>
    )
}
