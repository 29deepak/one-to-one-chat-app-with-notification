import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast';
import './Register.css'
import { registerSchema } from '../schemas';
import { registerUser } from '../../helper/helper';
const Register = () => {
    const navigate = useNavigate()
    const [open, isOpen] = useState(false)
    const [confirm, isConfirm] = useState(false)
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmpassword: ""
        },
        validationSchema: registerSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: (values) => {
            console.log(values)
            let registerPromise = registerUser(values)
            toast.promise(registerPromise, {
                loading: "creating...",
                success: (response) => (
                    <b>{response}</b>
                ),
                error: (error) => (
                    <b>{error}</b>
                )


            })
            registerPromise.then(() => {
                navigate("/login")
            }).catch((err) => {
                console.log(err)
            })

        }
    })
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/")
        }
    }, [])
    const eyeControlPassword = () => {
        isOpen(!open)
    }
    const eyeControlConfirmPassword = () => {
        isConfirm(!confirm)
    }


    return (
        <div className="containers">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className='img-icon'>
                <GrGroup className='img1' />

                <h1>Communicate To Each Other</h1>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='labels'>
                    <label>UserName:</label>
                    <input type="text" name="username" value={formik.values.username} placeholder='Enter username' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.username && formik.touched.username ? <p>{formik.errors.username}</p> : null}
                </div>
                <div className='labels'>
                    <label>Email:</label>
                    <input type="text" name="email" placeholder='Enter your email' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.email && formik.touched.email ? <p>{formik.errors.email}</p> : null}
                </div>
                <div className='labels'>
                    <label>Password:</label>
                    <div>

                        <input type={open ? 'text' : "password"} name="password" placeholder='enter the password' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <button onClick={eyeControlPassword} className='eye-icons'>{open ? <LuEye className='eye-ico' /> : <LuEyeOff className='eye-ico' />}</button>
                        {formik.errors.password && formik.touched.password ? <p>{formik.errors.password}</p> : null}
                    </div>
                </div>
                <div className='labels'>
                    <label>ConfirmPassword:</label>
                    <div>
                        <input type={confirm ? 'text' : "password"} name="confirmpassword" placeholder='enter the confirm password' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <button onClick={eyeControlConfirmPassword} className='eye-icons'>{confirm ? <LuEye className='eye-ico' /> : <LuEyeOff className='eye-ico' />}</button>
                        {formik.errors.confirmpassword && formik.touched.confirmpassword ? <p>{formik.errors.confirmpassword}</p> : null}
                    </div>
                </div>
                <div className='button-label'>

                    <button type="submit"> Register Now</button>
                </div>

            </form>
            <div>
                <h3>Already have An Account ? <Link className='anchor-link' to="/login">login</Link></h3>
            </div>
        </div>
    )
}

export default Register