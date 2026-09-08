import "../App.css";
import GradientBorder from "react-gradient-borders";

export default function Menu() {
    return (
        <GradientBorder colors={["#588377", "#c7c6cc"]}
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
             w-[75vw] h-[90vh]
             ">
                <div className="flex absolute top-1/20 left-1/30 min-h-1/10 min-w-1/10 bg-amber-50 rounded-2xl text-center items-center justify-center">Test</div>
                <label style={{color: "#FFFFFF"}} className="text-2xl">Logout</label>
            </div>
        </GradientBorder>
    )
}
