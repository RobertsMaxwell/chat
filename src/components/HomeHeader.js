import "../styles/HomeHeader.css"

import close from "../images/close.png"
import { useEffect, useState } from "react";
import { ref, push, set } from "firebase/database";

function HomeHeader (props) {
    const [messagePopup, setMessagePopup] = useState(false)
    const [message, setMessage] = useState("")

    const charLimit = 128

    // handle feed for home
    useEffect(() => {
        if(Object.keys(props.messages).length && Object.keys(props.users).length) {
            let tmp = []
            for(const key in props.messages) {
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
        }
    }, [props.messages, props.users])

    return (
        <div className="home_header">
            <h1 className="greeting">Connect with people</h1>
            <button onClick={() => {
                if(props.auth.currentUser !== null) {
                    setMessagePopup(true)
                } else {
                    props.setLoginPopup(true)
                }
                }}>Post a message</button>
            <h1 className="title">Recent messages</h1>
            {messagePopup ?
            <div className="message_popup">
                <img src={close} alt="close" onClick={() => {setMessagePopup(false)}} />
                <textarea value={message} onChange={e => {
                    if(e.target.value.length > charLimit) {
                        return
                    } else {
                        setMessage(e.target.value)
                    }
                    }} placeholder="Type a message" />
                <p>{`${message.length}/${charLimit}`}</p>
                <button onClick={() => {
                    if(message.length > 0) {
                        postMessage(props.auth, props.db, message)
                        setMessagePopup(false)
                        setMessage("")
                    }
                }}>Post</button>
            </div>
            : ""}
        </div>
    );
}

const postMessage = (auth, db, message) => {
    const postsRef = ref(db, "/messages")
    const newPostRef = push(postsRef)
    const postId = newPostRef._path.pieces_[1]
    set(newPostRef, {
        user: auth.currentUser.uid,
        message: message,
        likes: 0,
        replies: 0,
        time: new Date().getTime()
    })

    const userPostRef = ref(db, "/users/" + auth.currentUser.uid + "/messages/" + postId)
    set(userPostRef, {valid: "true"})
}

export default HomeHeader;