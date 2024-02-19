import React, { useState, useEffect } from 'react'
import { GrGroup } from "react-icons/gr";
import './Contacts.css'

const Contacts = ({ contacts, currentUser, changeChat, onlineUsers }) => {
    const [currentUserName, setCurrentUserName] = useState(undefined)
    const [currentUserImage, setCurrentUserImage] = useState(undefined)
    const [currentSelected, setCurrentSelected] = useState(undefined)
    const [findOnlineUsers, setFindOnlineUsers] = useState([])
    /* 
    import { unreadNotificationsFunction } from '../../helper/notification';
        const unreadNotifications = unreadNotificationsFunction(notifications)
    console.log("unread", unreadNotifications)
    const thisUserNotifications =unreadNotifications.filter(n=>n.senderId ==contacts.id)

     */

    /**
     * const[latestmesage,setLatestMesage] =useState()
     
    const last message =response[response.length-1]
    

     */

    /**
     const truncateMesage = (text) => {
        let shortText = text.substring(0, 20)
        if(text.length >20){
            shortText =shortText + ""
        }
        return shortText
    }
     */

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username)
        }
    }, [currentUser])
    const changedCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        changeChat(contact)
    }

    useEffect(() => {

        if (onlineUsers) {
            console.log("conat", onlineUsers)
            setFindOnlineUsers(onlineUsers)
        }
    }, [onlineUsers])

    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <div className='contact-container'>
                        <div className='brand'>
                            <GrGroup className='brand-logo' />
                            <h3>Communicate to each other</h3>

                        </div>
                        <div className='contacts'>
                            {
                                contacts.map((contact, index) => {
                                    return (
                                        <div className={`contact  ${index === currentSelected ? "selected" : ""}`} key={index} onClick={() => changedCurrentChat(index, contact)}>
                                            <div className='avatar'>
                                                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                                            </div>
                                            <div className='username'>
                                                <h3>{contact.username}</h3>
                                                {/* <span>{thisUserNotiifications.length >0 ? thisusernOtification.length :""}</span> */}
                                            </div>
                                            {findOnlineUsers.some(user => user.userId === contact.id) ? <span className='online'></span> : ""}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='current-user'>
                            <div className='avatar'>
                                <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="" />
                            </div>
                            <div className='username'>
                                <h2>{currentUserName}</h2>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Contacts