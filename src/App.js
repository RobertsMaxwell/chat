import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import Content from "./components/Content"
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyDT5tkTX2mOevPpNzsrknnPV4iU-mWOgjU",
    authDomain: "social-7d736.firebaseapp.com",
    databaseURL: "https://social-7d736-default-rtdb.firebaseio.com",
    projectId: "social-7d736",
    storageBucket: "social-7d736.appspot.com",
    messagingSenderId: "966546136510",
    appId: "1:966546136510:web:490134a3966c8a4193edef"
  };

  const firebase = initializeApp(firebaseConfig)
  const auth = getAuth(firebase)
  const db = getDatabase(firebase)

  const reduxState = useSelector((store) => {return store})
  const dispatch = useDispatch()

  const [currentUser, setCurrentUser] = useState(null)

  const [messages, setMessages] = useState({})
  const [users, setUsers] = useState({})

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch({type: "UPDATE_AUTH_DB", payload: {auth: auth, db: db}})

    onValue(ref(db, "/messages"), snapshot => {
      if(snapshot.val()) {
        setMessages(snapshot.val())
        dispatch({type: "UPDATE_MESSAGES", payload: snapshot.val()})
      }
    })

    onValue(ref(db, "/users"), snapshot => {
      if(snapshot.val()) {
        setUsers(snapshot.val())
        dispatch({type: "UPDATE_USERS", payload: snapshot.val()})
      }
    })

    onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      dispatch({type: "UPDATE_CURRENTUSER", payload: user})
    })
  }, [])

  useEffect(() => {
    if(Object.keys(reduxState.messages).length > 0 && Object.keys(reduxState.users).length > 0) {
      setTimeout(endLoadingScreen, 1000)
    }
  }, [messages, users])

  const endLoadingScreen = () => {
    setLoading(false)
    document.getElementsByTagName("body")[0].style.overflow = "visible";
    document.getElementsByTagName("body")[0].style.touchAction = "initial";
  }

  return (
    <div className="App">
      {loading ?
      <div className="loading_screen">
        <span className="initial_loader"></span>
      </div>
      : ""}
      <Content currentUser={currentUser} auth={auth} db={db} messages={messages} users={users} />
    </div>
  );
}

export default App;
