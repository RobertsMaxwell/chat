import { useState } from "react";
import "../styles/Feed.css"

import Message from "./Message"

function Feed (props) {
    const [displayed, setDisplayed] = useState(5)

    return (
        <div className="feed">
            {props.messages.slice(0, displayed).map((e, i) => <Message setLoginPopup={props.setLoginPopup} key={i} currentUser={props.currentUser} users={props.users} message={e} auth={props.auth} db={props.db} />)}
            <div className="footer">
                {displayed >= Object.keys(props.messages).length
                ?
                <p>You've reached the end.</p>
                :
                <button onClick={() => {setDisplayed(displayed + 5)}}>Load more</button>
                }
            </div>
        </div>
    );
}

export default Feed;