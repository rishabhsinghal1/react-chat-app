import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });

      if (querySnapshot.empty) {
        // If the query snapshot is empty, user is not found
        setErr(true);
      } else {
        setErr(false);
      }
    } catch (err) {
      console.error("Error retrieving user:", err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (e) => {
    const combineId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combineId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combineId), { messages: [] });

        try {
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combineId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combineId + ".date"]: serverTimestamp(),
          });

          await updateDoc(doc(db, "userChats", user.uid), {
            [combineId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combineId + ".date"]: serverTimestamp(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find a user"
          onKeyDown={handleKey}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />
      </div>
      {err && <span>User Not Found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="no profile" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
