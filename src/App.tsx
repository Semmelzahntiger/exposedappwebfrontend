import {Navigate, Route, Routes} from "react-router-dom";
import './App.css'
import Login from "./pages/Login.tsx";
import Menu from "./pages/Menu.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/menu" element={<Menu/>}/>
        </Routes>
    )
}

export default App
