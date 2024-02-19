import React from 'react'
import './Welcome.css'
import Robot from '../../assests/robot.gif'
const Welcome = ({ currentUser }) => {
    return (
        <>
            {
                currentUser && <><div className='welcome-container'>
                    <img src={Robot} alt="Robot" />
                    <h1>
                        Welcome <span>{currentUser.username}!</span>
                    </h1>
                    <h3>Please select a chat to start messaging.</h3>
                </div>
                </>
            }

        </>
    )
}

export default Welcome