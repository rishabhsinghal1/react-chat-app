import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { ChatContext } from '../context/ChatContext'
const Home = () => {
  const { data } = useContext(ChatContext);
  console.log(data.user);
  return (
    <div className='home'>
        <div className="container">
            <Sidebar />
            <Chat />
        </div>
    </div>
  )
}

export default Home