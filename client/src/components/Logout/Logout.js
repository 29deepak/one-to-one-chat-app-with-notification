import React from 'react'
import './Logout.css'
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { BiPowerOff } from 'react-icons/bi';
const Logout = () => {
    const navigate = useNavigate()
    const handleClick = async () => {
        localStorage.clear()
        toast.success("Logout Successfully")
        navigate("/login")
    }
    return (
        <button className='logout-container' onClick={handleClick}>
            <BiPowerOff />
        </button>
    )
}

export default Logout