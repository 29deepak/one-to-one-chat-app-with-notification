import React, { useState } from 'react'
import './ChatInput.css'
import EmojiPicker from 'emoji-picker-react'

import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
const ChatInput = ({ handleSendMsg }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("")

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }
    const handleEmojiClick = (emojiObject, emojiUnicode) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message)
    }
    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("")
        }
    }

    return (
        <>
            <div className='chat-input-container'>
                <div className='button-container'>
                    <div className='emoji'>
                        <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                        {
                            showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />
                        }
                    </div>
                </div>
                <form className='input-container' onSubmit={(e) => sendChat(e)}>
                    <input type="text" placeholder='type your message here' value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <button className='submit'><IoMdSend /></button>
                </form>
            </div>
        </>
    )
}

export default ChatInput