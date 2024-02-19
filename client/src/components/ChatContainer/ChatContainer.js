import React, { useEffect, useState, useRef } from 'react'
import './ChatContainer.css'
import Logout from '../Logout/Logout'
import ChatInput from '../ChatInput/ChatInput'
import Message from '../Message/Message'
import { getMsgRoute, sendMsgRoute } from '../../helper/helper'
import { v4 as uuidv4 } from "uuid";
import { unreadNotificationsFunction } from '../../helper/notification';
import Notifications from '../Notification/Notifications'



const ChatContainer = ({ currentChat, contacts, currentUser, socket, changeChatConatiner }) => {
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const scrollRef = useRef()
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        if (currentChat && currentUser) {
            async function fetchInfo() {

                let senderInfo = {
                    from: currentUser.id,
                    to: currentChat.id
                }
                const messageRoutes = await getMsgRoute(senderInfo)
                return messageRoutes
            }
            fetchInfo().then((response) => {
                setMessages(response.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [currentChat])
    const handleSendMsg = async (msg) => {
        if (currentChat && currentUser) {

            let senderData = {
                from: currentUser.id,
                to: currentChat.id,
                message: msg
            }
            await sendMsgRoute(senderData)
            socket.emit('send-msg', {
                to: currentChat.id,
                from: currentUser.id,
                message: msg
            })
            const msgs = [...messages]
            msgs.push({ fromSelf: true, message: msg })
            setMessages(msgs)
        }
    }
    useEffect(() => {
        if (socket) {
            socket.on("msg-received", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg })
            })
        }
        return () => {
            if (socket) {
                socket.off("msg-received")
            }
        }
    }, [socket])
    useEffect(() => {
        if (socket && currentChat) {

            socket.on("get-notification", (res) => {
                console.log("dfhcj", currentChat)
                const isOpen = currentChat.id === res.senderId;
                console.log("Dhc", isOpen)

                if (isOpen) {
                    setNotifications(prev => [{ ...res, isRead: true }, ...prev])
                } else {
                    setNotifications(prev => [res, ...prev])
                }
            })
        }
        return () => {
            if (socket) {
                socket.off("get-notification")
            }
        }
    }, [socket, currentChat])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])


    console.log("fvhnn", notifications)
    const unreadNotifications = unreadNotificationsFunction(notifications)
    console.log("unread", unreadNotifications)
    const modifiedNotifications = notifications.map((n) => {
        const sender = contacts.find(user => user.id === n.senderId)
        return {
            ...n,
            senderName: sender.username
        }
    })
    console.log("filter", modifiedNotifications)

    const handleMarkAsRead = () => {
        const markAsReadNotifications = notifications.map((n) => {
            return {
                ...n,
                isRead: true
            }
        })
        setNotifications(markAsReadNotifications)
    }
    console.log("dch cbc ", notifications)

    const markNotificationAsRead = (n) => {
        //find chat to open
        // const desiredChat = currentChat.find(chat => {
        // const chatMembers = [currentUser.id, n.senderId]
        // const isDesiredChat = chat.members.every((member) => {
        //     return chatMembers.includes(member)
        // })
        function updateChat() {

            const isDesiredChat = contacts.filter((user) => user.id === n.senderId)

            console.log("isDesiredchat", isDesiredChat)
            return isDesiredChat
        }
        // return isDesiredChat
        // })
        const mNotificattions = notifications.map(el => {
            if (n.senderId === el.senderId) {
                return {
                    ...n,
                    isRead: true
                }
            } else {
                return el
            }
        })
        // updateCurrentChat(desiredChat)
        const a = updateChat()
        console.log("vhbjv  nnn ", a)
        // changeChat(a)
        changeChatConatiner(a)

        setNotifications(mNotificattions)
    }




    return (
        <>

            {
                currentChat && (
                    <div className='chat-message-container'>
                        <div className='chat-header'>
                            <div className='user-details'>
                                <div className='avatar'>
                                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
                                </div>
                                <div className='username'>
                                    <h3>{currentChat.username}</h3>
                                </div>
                            </div>
                            {/* <div style={{ color: "white" }}>
                                message<sup>{unreadNotifications.length}</sup>
                            </div> */}
                            <Notifications unreadNotifications={unreadNotifications} modifiedNotifications={modifiedNotifications} handleChange={handleMarkAsRead} markNotificationAsRead={markNotificationAsRead} />
                            <Logout />
                        </div>
                        {/* <Message /> */}
                        <div className='chat-messages'>

                            {
                                messages.map((message) => {
                                    return (
                                        <div ref={scrollRef} key={uuidv4()}>
                                            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                                                <div className='content'>
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }



                        </div>
                        <ChatInput handleSendMsg={handleSendMsg} />
                    </div>
                )
            }
        </>
    )
}

export default ChatContainer