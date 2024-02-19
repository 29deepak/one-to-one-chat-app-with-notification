import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { allUsersRoute, decodeUserToken } from '../../helper/helper';
import Contacts from '../Contacts/Contacts';
import Welcome from '../Welcome/Welcome';
import ChatContainer from '../ChatContainer/ChatContainer';
import { io } from 'socket.io-client'
const Chat = () => {
    const navigate = useNavigate()
    const [contacts, setContacts] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/login")
        }
        async function fetchData() {
            const user = await decodeUserToken()
            const allUser = await allUsersRoute(user.userId)
            return allUser

        }
        fetchData().then((response) => {

            setCurrentUser(response.data.loginusers)
            setContacts(response.data.users)
            setIsLoaded(true)
        }).catch((err) => {
            toast.error(err)
        })

        // return (() => {


        // })

    }, [])
    useEffect(() => {
        const newSocket = io("http://localhost:4000")
        console.log(newSocket)
        setSocket(newSocket)
        return () => {
            console.log("-----------------")
            newSocket.disconnect()
            console.log("--------------------2")
        }
    }, [currentUser])
    // add online users
    useEffect(() => {
        if (socket === null) return;
        if (socket && currentUser) {

            console.log("----------add-user")
            socket.emit("add-user", currentUser.id)
            socket.on("getOnlineUsers", (res) => {
                setOnlineUsers(res)
            })
        }
        return () => {
            if (socket) {
                socket.off("getOnlineUsers")
            }
        }
    }, [socket])
    console.log(onlineUsers)
    useEffect(() => {
        if (currentUser) {
            if (!currentUser.isAvatarImageSet) {
                navigate('/setAvatar')
            }
        }
    }, [currentUser])
    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }
    const handleChatChangeInContainer = (IndividualChat) => {
        console.log("fgjb ", IndividualChat)
        setCurrentChat(IndividualChat[0])

    }
    return (
        <>
            <div className='chat-container'>
                <div className='chat-container-content'>
                    <Contacts contacts={contacts} currentUser={currentUser} onlineUsers={onlineUsers} changeChat={handleChatChange} />
                    {isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser} /> : <ChatContainer currentChat={currentChat} contacts={contacts} currentUser={currentUser} socket={socket} changeChatConatiner={handleChatChangeInContainer} />}


                </div>

            </div>
        </>
    )
}

export default Chat