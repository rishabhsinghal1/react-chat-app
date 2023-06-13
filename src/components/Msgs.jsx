import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
const Msgs = () => {

  const [messages, setMessages] = useState([]);

  const { data } = useContext(ChatContext);

  useEffect(()=> {
    try{const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages);
      return ()=> {
        unsub();
      }
    });}catch(err){
      console.log(err);
    }
  },[data.chatId]);
  return (
      <div className='msgs'>
        {messages.map((m)=> (
          <Message message={m} key={m.id}/>
          
        ))}
    </div>
  );
};

export default Msgs;