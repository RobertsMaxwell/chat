import "../styles/HomeHeader.css"

import close from "../images/close.png"
import { useEffect, useState } from "react";
import { ref, push, set } from "firebase/database";
import { useSelector } from "react-redux";

function HomeHeader (props) {
    const [messagePopup, setMessagePopup] = useState(false)
    const [message, setMessage] = useState("")

    const charLimit = 128

    const reduxState = useSelector((store) => {return store})

    // handle feed for home
    useEffect(() => {
        if(Object.keys(reduxState.messages).length && Object.keys(reduxState.users).length) {
            let tmp = []
            for(const key in reduxState.messages) {
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
        }
    }, [reduxState.messages, reduxState.users])

    return (
        <div className="home_header">
            <h1 className="greeting">Connect with people</h1>
            <button onClick={() => {
                if(reduxState.currentUser !== null) {
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
                        postMessage(reduxState.auth, reduxState.db, message)
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