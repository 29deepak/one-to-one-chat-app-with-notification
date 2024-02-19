import React, { useState } from 'react'
import moment from 'moment/moment';
import './Notifications.css'
import { FaRegMessage } from "react-icons/fa6";
const Notifications = ({ unreadNotifications, modifiedNotifications, handleChange, markNotificationAsRead }) => {
    const [isOpen, setIsOpen] = useState(false)
    const handlePopUpMessage = () => {
        setIsOpen(!isOpen)
    }
    const handleMarkAsRead = () => {
        handleChange()
    }
    const handlerMarkNotificationAsRead = (n) => {
        markNotificationAsRead(n)
        setIsOpen(!isOpen)
    }
    return (
        <>
            <div className='notification-container'>
                <div><FaRegMessage className='brand-logo1' onClick={handlePopUpMessage} /><sup className='sup'>{unreadNotifications.length === 0 ? "" : unreadNotifications.length}</sup> </div>

                {isOpen ? <div style={{ color: "white" }}>
                    <h3>notifications</h3>
                    <div onClick={handleMarkAsRead} class="mark-as" >Mark all as read</div>
                    {modifiedNotifications.length === 0 ? <span>No notifications yet...</span> : ""}
                    {modifiedNotifications && modifiedNotifications.map((n, index) => {
                        return <div key={index} className={n.isRead ? 'notification' : 'notificatio not-read'} onClick={() => { handlerMarkNotificationAsRead(n) }}>
                            <span>{`${n.senderName} sent you a new message`}</span>
                            <span>{moment(n.date).calendar()}</span>
                        </div>
                    })}
                </div> : ""}

            </div>
        </>
    )
}

export default Notifications