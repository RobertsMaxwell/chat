import "../styles/CommentHeader.css"

import pfp from "../images/default_pfp.jpg"
import favorite from "../images/favorite.png"
import favorite_filled from "../images/favorite_filled.png"
import comment from "../images/comment.png"

import {likePost} from "./Message"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { push, ref, set } from "firebase/database"

import alligator from "../images/pfp/alligator.png"
import buffalo from "../images/pfp/buffalo.png"
import llama from "../images/pfp/llama.png"
import moose from "../images/pfp/moose.png"
import zebra from "../images/pfp/zebra.png"
import { useSelector } from "react-redux"

const pfps = [buffalo, llama, moose, zebra, alligator]

function CommentHeader (props) {
    const [message, setMessage] = useState(null)
    const navigate = useNavigate();
    const { commentId } = useParams();

    const [replyMessage, setReplyMessage] = useState("")

    const reduxState = useSelector((store) => {return store})

    useEffect(() => {
        if(Object.keys(reduxState.users).length && Object.keys(reduxState.messages)) {
            const msg = reduxState.messages[commentId]
            if(!msg) {
                alert("Invalid Message Id")
                navigate("/")
            }
            const user = reduxState.users[msg.user]
            setMessage({
                id: commentId,
                handle: user.username,
                message: msg.message,
                likeCount: msg.likes,
                replyCount: msg.replies,
                pfp: user.pfp
            })

            if(msg.repliesArray) {
                let tmp = []
                for(const key of Object.keys(msg.repliesArray)) {
                    const reply = msg.repliesArray[key]
                    tmp.push({
                        handle: reduxState.users[reply.user].username,
                        pfp: reduxState.users[reply.user].pfp,
                        message: reply.message
                    })
                }
                props.setMessages(tmp)
            } else {
                props.setMessages([])
            }
        }
    }, [reduxState.users, reduxState.messages])

    return (
        <div className="comment_header">
            <div className="message">
                <div className="data">
                    <div className="pfp">
                        <img src={message ? pfps[message.pfp - 1] : pfp} alt="pfp" onClick={() => {
                            if(message) {
                                navigate(`/users/${message.handle}`)
                            }
                        }} />
                    </div>
                    <div className="text">
                        <h1 onClick={() => {
                            if(message) {
                                navigate(`/users/${message.handle}`)
                            }
                        }}>@{message ? message.handle : ""}</h1>
                        <p>{message ? message.message : ""}</p>
                    </div>
                </div>
                <div className="ratings">
                    <>
                        <img onClick={() => {
                            if(!reduxState.currentUser) {
                                props.setLoginPopup(true)
                                return
                            }
                            likePost(message, reduxState.auth, reduxState.db, reduxState.users)
                            }} src={message && reduxState.auth.currentUser && reduxState.users[reduxState.auth.currentUser.uid] && reduxState.users[reduxState.auth.currentUser.uid].liked && reduxState.users[reduxState.auth.currentUser.uid].liked.includes(message.id) ? favorite_filled : favorite} alt="favorite" />
                        <p>{message ? message.likeCount : ""}</p>
                    </>
                    <>
                        <img src={comment} alt="comment" />
                        <p>{message ? message.replyCount : ""}</p>
                    </>
                </div>
            </div>
            <div className="reply">
                <input value={replyMessage} onChange={e => {
                    if(e.target.value.length > 128) {
                        return
                    } else {
                        setReplyMessage(e.target.value)
                    }
                }}type="text" placeholder="Write a reply..." />
                <button onClick={() => {
                    if(!reduxState.currentUser) {
                        props.setLoginPopup(true)
                        return
                    }
                    if(replyMessage.length > 0) {
                        const replyRef = ref(reduxState.db, "/messages/" + commentId + "/repliesArray")
                        set(push(replyRef), {
                            message: replyMessage,
                            user: reduxState.currentUser.uid,
                        })
                        set(ref(reduxState.db, "/messages/" + commentId + "/replies"), reduxState.messages[commentId].replies + 1)
                        setReplyMessage("")
                    }
                }}>Reply</button>
            </div>
            <h1 className="title">Replies</h1>
        </div>
    );
}

export default CommentHeader;