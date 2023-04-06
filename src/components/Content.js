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

function Content (props) {
    const [loginPopup, setLoginPopup] = useState(false)
    const [menuPopup, setMenuPopup] = useState(false)
    const [curatedMessages, setCuratedMessages] = useState([])

    return (
        <div className="content">
            {menuPopup ? <MenuPopup setPopup={setMenuPopup} auth={props.auth} currentUser={props.currentUser} setLoginPopup={setLoginPopup} /> : ""}
            <Options setMenuPopup={setMenuPopup} currentUser={props.currentUser} auth={props.auth} setLoginPopup={setLoginPopup} />
            {loginPopup ? <LoginPopup currentUser={props.currentUser} db={props.db} auth={props.auth} setPopup={setLoginPopup} /> : ""}

            <Routes>
                <Route path="/" element={<HomeHeader auth={props.auth} db={props.db} setLoginPopup={setLoginPopup} messages={props.messages} users={props.users} setMessages={setCuratedMessages} />} />
                <Route path="/users/:handle" element={<ProfileHeader auth={props.auth} db={props.db} messages={props.messages} users={props.users} currentUser={props.currentUser} setMessages={setCuratedMessages} />} />
                <Route path="/comment/:commentId" element={<CommentHeader currentUser={props.currentUser} setLoginPopup={setLoginPopup} auth={props.auth} db={props.db} messages={props.messages} users={props.users} setMessages={setCuratedMessages} />} />
            </Routes>
            <Feed messages={curatedMessages} setLoginPopup={setLoginPopup} currentUser={props.currentUser} users={props.users} auth={props.auth} db={props.db} />
        </div>
    );
}

export default Content;