import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Chats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  // console.log(chats);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="no profile" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>
                {chat[1].lastMessage && (
                  <p>
                    {chat[1].lastMessage.text.length > 30
                      ? `${chat[1].lastMessage.text.slice(0, 30)}...`
                      : chat[1].lastMessage.text}
                  </p>
                )}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
