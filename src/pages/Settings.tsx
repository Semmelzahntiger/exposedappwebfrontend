import GradientBorder from "react-gradient-borders";
import {useNavigate} from "react-router-dom";

export function Settings() : React.JSX.Element {
    const navigate = useNavigate();
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
             flex flex-col gap-2 items-end justify-start m-5
             w-[10vw] h-[20vh]
             ">
            <button style={{ fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"}} className="btn min-w-1/10 min-h-1/10" onClick={() => { navigate("/menu") }}>
                <span style={{ fontFamily: "'Material Symbols Rounded Variable', sans-serif", fontVariantLigatures: "normal"}}>close</span>
            </button>
            <button className="btn relative left-1/2 -translate-x-1/2 w-full mt-5" onClick={() => {
                navigate("/settings/account")
            }}>Account Settings</button>
            <button className="btn relative left-1/2 -translate-x-1/2 w-full" onClick={() => {
                navigate("/settings/upload")
            }}>Upload Data</button>
        </div>
    </GradientBorder>
)
}