import favorite from "../images/favorite.png"
import favorite_filled from "../images/favorite_filled.png"
import comment from "../images/comment.png"
import { useNavigate } from "react-router-dom";
import { ref, set, update } from "firebase/database";

import alligator from "../images/pfp/alligator.png"
import buffalo from "../images/pfp/buffalo.png"
import llama from "../images/pfp/llama.png"
import moose from "../images/pfp/moose.png"
import zebra from "../images/pfp/zebra.png"

const pfps = [buffalo, llama, moose, zebra, alligator]

function Message (props) {
    const navigate = useNavigate();

    return (
        <div className="message">
            <div className="data">
                <div className="pfp">
                    <img onClick={() => {navigate(`/users/${props.message.handle}`)}} src={pfps[props.message.pfp - 1]} alt="pfp" />
                </div>
                <div className="text">
                    <h1 onClick={() => {navigate(`/users/${props.message.handle}`)}}>@{props.message.handle}</h1>
                    <p className={props.message.replyCount !== undefined ? "clickable" : ""} onClick={() => {
                        if(props.message.replyCount !== undefined) {
                            navigate("/comment/" + props.message.id)
                        }
                    }}>{props.message.message}</p>
                </div>
            </div>
            {props.message.replyCount !== undefined ?
            <>
                <div className="ratings">
                    <>
                        <img onClick={() => {
                            if(!props.currentUser) {
                                props.setLoginPopup(true)
                                return
                            }
                            likePost(props.message, props.auth, props.db, props.users)
                        }}src={props.currentUser && props.users[props.currentUser.uid].liked && props.users[props.currentUser.uid].liked.includes(props.message.id) ? favorite_filled : favorite} alt="favorite" />
                        <p>{props.message.likeCount}</p>
                    </>
                    <>
                        <img onClick={() => {
                            navigate("/comment/" + props.message.id)
                        }} src={comment} alt="comment" />
                        <p>{props.message.replyCount}</p>
                    </>
                </div>
                {props.message.replyCount > 0 ?
                <div className="expand">
                    <p onClick={() => {navigate("/comment/" + props.message.id)}}>Show replies</p>
                </div>
                : ""}
            </>
            : ""}
        </div>
    );
}

export const likePost = (post, auth, db, users) => {
    const postRef = ref(db, "/messages/" + post.id + "/likes")
    const userRef = ref(db, "/users/" + auth.currentUser.uid + "/liked")

    let tmp = []
    if(users[auth.currentUser.uid].liked) {
        tmp = [...users[auth.currentUser.uid].liked]
    }

    if(tmp.includes(post.id)) {
        set(postRef, post.likeCount - 1)
        tmp.splice(tmp.indexOf(post.id), 1)
        set(userRef, tmp)
    } else {
        set(postRef, post.likeCount + 1)
        set(userRef, [...tmp, post.id])
    }
}

export default Message;