import { useEffect, useState } from "react";
import "../styles/LoginPopup.css"

import close from "../images/close.png"

import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { ref, set } from "firebase/database";

function LoginPopup (props) {
    const [loginPage, setLoginPage] = useState(true)
    const [loading, setLoading] = useState(false)

    const [loginInfo, setLoginInfo] = useState({username: "", password: ""})
    const [signupInfo, setSignupInfo] = useState({username: "", password: "", cpassword: ""})

    useEffect(() => {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        document.getElementsByTagName("body")[0].style.touchAction = "none";

        return () => {
            document.getElementsByTagName("body")[0].style.overflow = "visible";
            document.getElementsByTagName("body")[0].style.touchAction = "initial";
        }
    }, [])

    useEffect(() => {
        if(props.currentUser !== null) {
            props.setPopup(false)
        }
    }, [props.currentUser])

    const usernameError = str => {
        if(str.length === 0) {
            return ""
        } else if(str.length > 12) {
            return "Username cannot exceed 12 characters"
        } else if (str.length < 3) {
            return "Username must be at least 3 characters"
        } else if(!str.match(/^[a-z0-9]+$/i)) {
            return "Username must be alphanumeric"
        } else {
            return ""
        }
    }

    const passwordError = str => {
        if(str.length === 0) {
            return ""
        } else if(str.length > 15) {
            return "Password cannot exceed 15 characters"
        } else if (str.length < 6) {
            return "Password must be at least 6 characters"
        } else {
            return ""
        }
    }

    const signupErrors = () => {
        if(signupInfo.username === "" || signupInfo.password === "") {
            return "All fields are required"
        } else if (signupInfo.password !== signupInfo.cpassword) {
            return "Passwords do not match"
        } else {
            return usernameError(signupInfo.username) + passwordError(signupInfo.password)
        }
    }

    const loginErrors = () => {
        if(loginInfo.username === "" || loginInfo.password === "") {
            return "All fields are required"
        } else {
            return usernameError(loginInfo.username) + passwordError(loginInfo.password)
        }
    }

    return (
        <div className="login_wrapper">
            <div className="login_popup">
                {loading ?
                <div className="spinner_wrapper">
                    <span className="spinner"></span>
                </div>
                : ""}
                <img src={close} alt="close" onClick={() => {props.setPopup(false)}} />
                {loginPage ?
                <>
                    <h1>Log in</h1>
                    <div className="group">
                        <p className="error">{usernameError(loginInfo.username)}</p>
                        <input type="text" placeholder="Username" value={loginInfo.username} onChange={e => {setLoginInfo({...loginInfo, username: e.target.value})}} />
                    </div>
                    <div className="group">
                        <p className="error">{passwordError(loginInfo.password)}</p>
                        <input type="password" placeholder="Password" value={loginInfo.password} onChange={e => {setLoginInfo({...loginInfo, password: e.target.value})}} />
                    </div>
                    <button onClick={() => {
                        if(loginErrors() !== "") {
                            alert(loginErrors())
                            return
                        } else {
                            setLoading(true)
                            signInWithEmailAndPassword(props.auth, loginInfo.username + "@example.com", loginInfo.password)
                            .then(() => {
                                props.setPopup(false)
                            })
                            .catch(e => {
                                setLoading(false)
                                alert(e.message)
                            })
                        }
                    }}>Log in</button>
                    <div className="divider" />
                    <button className="switch_page" onClick={() => {setLoginPage(false)}}>Create Account</button>
                </>
                :
                <>
                    <h1>Create account</h1>
                    <div className="group">
                        <p className="error">{usernameError(signupInfo.username)}</p>
                        <input type="text" placeholder="Username" value={signupInfo.username} onChange={e => {setSignupInfo({...signupInfo, username: e.target.value})}} />
                    </div>
                    <div className="group">
                        <p className="error">{passwordError(signupInfo.password)}</p>
                        <input type="password" placeholder="Password" value={signupInfo.password} onChange={e => {setSignupInfo({...signupInfo, password: e.target.value})}} />
                    </div>
                    <div className="group">
                        <p className="error">{signupInfo.password !== signupInfo.cpassword ? "Password doesn't match" : ""}</p>
                        <input type="password" placeholder="Confirm Password" value={signupInfo.cpassword} onChange={e => {setSignupInfo({...signupInfo, cpassword: e.target.value})}} />
                    </div>
                    <button onClick={() => {
                        if(signupErrors() !== "") {
                            alert(signupErrors())
                            return
                        } else {
                            setLoading(true)
                            createUserWithEmailAndPassword(props.auth, signupInfo.username + "@example.com", signupInfo.password)
                            .then((userCred) => {
                                createUserProfile(userCred.user, props.db)
                                .then(() => {
                                    props.setPopup(false)
                                })
                                .catch(e => {
                                    setLoading(false)
                                    alert(e.message)
                                })
                            })
                            .catch(e => {
                                setLoading(false)
                                alert(e.message)
                            })
                        }
                    }}>Sign up</button>
                    <div className="divider" />
                    <p>Already have an account? <a onClick={() => {setLoginPage(true)}}>Login</a></p>
                </> }
            </div>
        </div>
    );
}

const createUserProfile = async (user, db) => {
    const userRef = ref(db, "/users/" + user.uid)
    await set(userRef, {username: user.email.split("@")[0], pfp: Math.ceil(Math.random() * 5), desc: "This is the default user description."})
}

export default LoginPopup;