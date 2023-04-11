import "../styles/ProfileHeader.css"

import pfp from "../images/default_pfp.jpg"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import alligator from "../images/pfp/alligator.png"
import buffalo from "../images/pfp/buffalo.png"
import llama from "../images/pfp/llama.png"
import moose from "../images/pfp/moose.png"
import zebra from "../images/pfp/zebra.png"
import { ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const pfps = [buffalo, llama, moose, zebra, alligator]

function ProfileHeader (props) {
    const [profile, setProfile] = useState(null)
    const [editPopup, setEditPopup] = useState(false)

    const [newDescription, setNewDescription] = useState("")
    const { handle } = useParams();

    const navigate = useNavigate();
    const reduxState = useSelector((store) => {return store})

    useEffect(() => {
        if(Object.keys(reduxState.messages).length && Object.keys(reduxState.users).length) {
            let uid = -1
            for(const key of Object.keys(reduxState.users)) {
                if(reduxState.users[key].username === handle) {
                    uid = key
                    break
                }
            }

            if(reduxState.users[uid]) {
                setProfile({...reduxState.users[uid], id: uid})
                let tmp = []
                for(const key of Object.keys(reduxState.messages).filter(e => reduxState.messages[e].user === uid)) {
                    const msg = reduxState.messages[key]
                    tmp.push({
                        id: key,
                        handle: reduxState.users[msg.user].username,
                        pfp: reduxState.users[msg.user].pfp,
                        message: msg.message,
                        likeCount: msg.likes,
                        replyCount: msg.replies,
                        time: msg.time
                    })
                }
                tmp.sort((a, b) => b.time - a.time)
                props.setMessages(tmp)
            } else {
                alert("Cant find user")
                navigate("/")
            }
        }
    }, [reduxState.messages, reduxState.users, handle])

    return (
        <div className="profile_header">
            <img src={profile ? pfps[profile.pfp - 1] : pfp} alt="pfp" />
            <h1 className="handle">@{profile ? profile.username : ""}</h1>
            <p className="description">{profile ? profile.desc : ""}</p>
            {reduxState.auth.currentUser && reduxState.auth.currentUser.email.split("@")[0] === handle ?
            <button onClick={() => {setEditPopup(!editPopup)}}>Edit</button>
            : ""}
            <h1 className="title">{profile ? `${profile.username}'s recent messages` : ""}</h1>

            {editPopup ?
            <div className="edit_popup_wrapper">
                <div className="edit_popup">
                    <textarea value={newDescription} onChange={e => {
                        if(e.target.value.length > 128) {
                            return
                        }
                        setNewDescription(e.target.value)
                        }} placeholder="Update description" />
                    <button onClick={() => {
                        if(newDescription.length <= 0) {
                            return
                        }
                        const descRef = ref(reduxState.db, "/users/" + profile.id + "/desc")
                        set(descRef, newDescription)
                        setNewDescription("")
                        setEditPopup(false)
                    }}
                    >Update</button>
                </div>
            </div>
            : "" }
        </div>
    );
}

export default ProfileHeader;