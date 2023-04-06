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

const pfps = [alligator, buffalo, llama, moose, zebra]

function ProfileHeader (props) {
    const [profile, setProfile] = useState(null)
    const [editPopup, setEditPopup] = useState(false)

    const [newDescription, setNewDescription] = useState("")
    const { handle } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if(Object.keys(props.messages).length && Object.keys(props.users).length) {
            let uid = -1
            for(const key of Object.keys(props.users)) {
                if(props.users[key].username === handle) {
                    uid = key
                    break
                }
            }

            if(props.users[uid]) {
                setProfile({...props.users[uid], id: uid})
                let tmp = []
                for(const key of Object.keys(props.messages).filter(e => props.messages[e].user === uid)) {
                    const msg = props.messages[key]
                    tmp.push({
                        id: key,
                        handle: props.users[msg.user].username,
                        pfp: props.users[msg.user].pfp,
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
    }, [props.messages, props.users, handle])

    return (
        <div className="profile_header">
            <img src={profile ? pfps[profile.pfp] : pfp} alt="pfp" />
            <h1 className="handle">@{profile ? profile.username : ""}</h1>
            <p className="description">{profile ? profile.desc : ""}</p>
            {props.currentUser && props.currentUser.email.split("@")[0] === handle ?
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
                        const descRef = ref(props.db, "/users/" + profile.id + "/desc")
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