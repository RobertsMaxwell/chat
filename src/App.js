import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import Content from "./components/Content"
import { useEffect, useState } from 'react';

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

  const [currentUser, setCurrentUser] = useState(null)

  const [messages, setMessages] = useState({})
  const [users, setUsers] = useState({})

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    onValue(ref(db, "/messages"), snapshot => {
      if(snapshot.val()) {
        setMessages(snapshot.val())
      }
    })

    onValue(ref(db, "/users"), snapshot => {
      if(snapshot.val()) {
        setUsers(snapshot.val())
      }
    })

    onAuthStateChanged(auth, user => {
      setCurrentUser(user)
    })
  }, [])

  useEffect(() => {
    if(Object.keys(messages).length > 0 && Object.keys(users).length > 0) {
      setTimeout(endLoadingScreen, 1000)
    }
  }, [messages, users])

  const endLoadingScreen = () => {
    setLoading(false)
    document.getElementsByTagName("body")[0].style.overflow = "visible";
  }

  return (
    <div className="App">
      {loading ?
      <div className="loading_screen">
        Loading...
      </div>
      : ""}
      <Content currentUser={currentUser} auth={auth} db={db} messages={messages} users={users} />
    </div>
  );
}

export default App;
