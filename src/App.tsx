import {Navigate, Route, Routes} from "react-router-dom";
import './App.css'
import Login from "./pages/Login.tsx";
import {Register} from "./pages/Register.tsx";
import Menu from "./pages/Menu.tsx";
import {Settings} from "./pages/Settings.tsx";
import {Room} from "./pages/Room.tsx";
import {Game} from "./pages/Game.tsx";
import {Upload} from "./pages/Upload.tsx";
import {AccountSettings} from "./pages/AccountSettings.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/menu" element={<Menu/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/room" element={<Room/>}></Route>
            <Route path={"/game"} element={<Game/>}></Route>
            <Route path={"/settings/account"} element={<AccountSettings/>}></Route>
            <Route path={"/settings/upload"} element={<Upload/>}></Route>
        </Routes>
    )
}

export default App
