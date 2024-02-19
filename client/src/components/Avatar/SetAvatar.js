import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Buffer } from 'buffer';
import loader from '../../assests/loader.gif'
import './SetAvatar.css'
import { avatarSetUser, decodeUserToken } from '../../helper/helper';

const SetAvatar = () => {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate()
    const [avatars, setAvatar] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatars, setSelectedAvatar] = useState(undefined);
    const setProfilePicture = async () => {
        if (selectedAvatars === undefined) {
            toast.error("please select a avatar")
        } else {
            const user = await decodeUserToken()
            const avatarUser = await avatarSetUser({ id: user.userId, image: avatars[selectedAvatars] })
            if (avatarUser.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = avatarUser.image;
                // localStorage.setItem("token",JSON.stringify(user))
                navigate("/")
            }
            else {
                toast.error("Error Setting avatar ,Please try again")
            }

        }
    }
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/login")
        }
    }, [])
    useEffect(() => {
        async function fetchAvatar() {

            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
                const buffer = new Buffer(image.data);
                data.push(buffer.toString('base64'))

            }
            return data
        }
        return () => {

            fetchAvatar().then((data) => {
                setAvatar(data)
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
            })

        }

    }, [])



    return (
        <>
            {
                isLoading ? <div className='loading'>
                    <img src={loader} alt="loader" />
                </div> :
                    (<div className="avatar-container">
                        <Toaster position='bottom-right' reverseOrder={false}></Toaster>
                        <div className='title-container'>
                            <h1>
                                pick an avatar as your profile picture
                            </h1>
                        </div>
                        <div className='avatars'>
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div key={index} className={`avatar ${selectedAvatars === index ? "selected" : ""}`}>
                                            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="btn">
                            <button onClick={setProfilePicture} >SET AS PROFILE PICTURE</button>
                        </div>
                    </div>)
            }

        </>
    )
}

export default SetAvatar