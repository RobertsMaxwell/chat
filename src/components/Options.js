import { useNavigate } from "react-router-dom";
import "../styles/Options.css"
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import menu from "../images/menu.png"

function Options (props) {
    const navigate = useNavigate();
    const [menuPopup, setMenuPopup] = useState(false);
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="options_wrapper">
            <div className="options">
                {width > 1111 ?
                <>
                    <h1 onClick={() => {navigate("/")}}>Home</h1>
                    {props.currentUser === null ?
                    <h1 onClick={() => {props.setLoginPopup(true)}}>Sign in</h1>
                    :
                    <>
                        <h1 onClick={() => {navigate("/users/" + props.currentUser.email.split("@")[0])}}>Profile</h1>
                        <h1 onClick={() => {
                            signOut(props.auth)
                            .catch(e => {
                                alert(e.message)
                            })
                        }}>Logout</h1>
                    </> }
                </>
                :
                <img onClick={() => {props.setMenuPopup(true)}} src={menu} alt="menu" />
                }
            </div>
        </div>
    );
}

export default Options