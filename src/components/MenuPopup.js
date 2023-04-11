import { signOut } from "firebase/auth";
import "../styles/MenuPopup.css"
import { useNavigate } from "react-router-dom";
import close from "../images/close.png"
import { useSelector } from "react-redux";

function MenuPopup (props) {
    const navigate = useNavigate();
    const reduxState = useSelector((store) => {return store})

    return (
        <div className="menu_popup">
             <h1 onClick={() => {
                navigate("/")
                props.setPopup(false)
                }}>Home</h1>
            {reduxState.currentUser === null ?
            <h1 onClick={() => {
                props.setLoginPopup(true)
                props.setPopup(false)
            }}>Sign in</h1>
            :
            <>
                <h1 onClick={() => {
                    navigate("/users/" + reduxState.currentUser.email.split("@")[0])
                    props.setPopup(false)
                    }}>Profile</h1>
                <h1 onClick={() => {
                    signOut(reduxState.auth)
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