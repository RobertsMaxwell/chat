import { signOut } from "firebase/auth";
import "../styles/MenuPopup.css"
import { useNavigate } from "react-router-dom";
import close from "../images/close.png"

function MenuPopup (props) {
    const navigate = useNavigate();

    return (
        <div className="menu_popup">
             <h1 onClick={() => {
                navigate("/")
                props.setPopup(false)
                }}>Home</h1>
            {props.currentUser === null ?
            <h1 onClick={() => {
                props.setLoginPopup(true)
                props.setPopup(false)
            }}>Sign in</h1>
            :
            <>
                <h1 onClick={() => {
                    navigate("/users/" + props.currentUser.email.split("@")[0])
                    props.setPopup(false)
                    }}>Profile</h1>
                <h1 onClick={() => {
                    signOut(props.auth)
                    .catch(e => {
                        alert(e.message)
                    })
                    props.setPopup(false)
                }}>Logout</h1>
            </> }
            <img src={close} alt="close" onClick={() => {props.setPopup(false)}} />
        </div>
    );
}

export default MenuPopup;