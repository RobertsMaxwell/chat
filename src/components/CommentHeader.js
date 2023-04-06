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

const pfps = [alligator, buffalo, llama, moose, zebra]

function CommentHeader (props) {
    const [message, setMessage] = useState(null)
    const navigate = useNavigate();
    const { commentId } = useParams();

    const [replyMessage, setReplyMessage] = useState("")

    useEffect(() => {
        if(Object.keys(props.users).length && Object.keys(props.messages)) {
            const msg = props.messages[commentId]
            if(!msg) {
                alert("Invalid Message Id")
                navigate("/")
            }
            const user = props.users[msg.user]
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
                        handle: props.users[reply.user].username,
                        pfp: props.users[reply.user].pfp,
                        message: reply.message
                    })
                }
                props.setMessages(tmp)
            } else {
                props.setMessages([])
            }
        }
    }, [props.users, props.messages])

    return (
        <div className="comment_header">
            <div className="message">
                <div className="data">
                    <div className="pfp">
                        <img src={message ? pfps[message.pfp] : pfp} alt="pfp" onClick={() => {
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
                            if(!props.auth.currentUser) {
                                props.setLoginPopup(true)
                                return
                            }
                            likePost(message, props.auth, props.db, props.users)
                            }} src={message && props.currentUser && props.users[props.currentUser.uid].liked && props.users[props.currentUser.uid].liked.includes(message.id) ? favorite_filled : favorite} alt="favorite" />
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
                    if(!props.auth.currentUser) {
                        props.setLoginPopup(true)
                        return
                    }
                    if(replyMessage.length > 0) {
                        const replyRef = ref(props.db, "/messages/" + commentId + "/repliesArray")
                        set(push(replyRef), {
                            message: replyMessage,
                            user: props.auth.currentUser.uid,
                        })
                        set(ref(props.db, "/messages/" + commentId + "/replies"), props.messages[commentId].replies + 1)
                        setReplyMessage("")
                    }
                }}>Reply</button>
            </div>
            <h1 className="title">Replies</h1>
        </div>
    );
}

export default CommentHeader;