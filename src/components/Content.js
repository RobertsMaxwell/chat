import "../styles/Content.css";

import Search from "./SearchBar"
import HomeHeader from "./HomeHeader"
import ProfileHeader from "./ProfileHeader"
import CommentHeader from "./CommentHeader"
import Feed from "./Feed"
import Options from "./Options"
import LoginPopup from "./LoginPopup"
import MenuPopup from "./MenuPopup"
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

function Content () {
    const [loginPopup, setLoginPopup] = useState(false)
    const [menuPopup, setMenuPopup] = useState(false)
    const [curatedMessages, setCuratedMessages] = useState([])

    return (
        <div className="content">
            {menuPopup ? <MenuPopup setPopup={setMenuPopup} setLoginPopup={setLoginPopup} /> : ""}
            <Options setMenuPopup={setMenuPopup} setLoginPopup={setLoginPopup} />
            {loginPopup ? <LoginPopup setPopup={setLoginPopup} /> : ""}

            <Routes>
                <Route path="/" element={<HomeHeader setLoginPopup={setLoginPopup} setMessages={setCuratedMessages} />} />
                <Route path="/users/:handle" element={<ProfileHeader setMessages={setCuratedMessages} />} />
                <Route path="/comment/:commentId" element={<CommentHeader setLoginPopup={setLoginPopup} setMessages={setCuratedMessages} />} />
            </Routes>
            <Feed messages={curatedMessages} setLoginPopup={setLoginPopup} />
        </div>
    );
}

export default Content;