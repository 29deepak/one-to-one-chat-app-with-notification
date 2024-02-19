import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { FaSpinner } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { loginSchema } from '../schemas';
import { verifyPassword } from '../../helper/helper';
const Login = () => {
    const navigate = useNavigate()
    const [open, isOpen] = useState(false)
    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: loginSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: (values) => {
            console.log(values)
            let loginPromise = verifyPassword({ username: values.username, password: values.password })
            toast.promise(loginPromise, {
                loading: 'loading',
                success: (response) => (
                    <b>{response.data.message}</b>
                ),
                error: (error) => (
                    <b>{error.err}</b>
                )


            })
            loginPromise.then((response) => {
                localStorage.setItem("token", response.data.token);
                navigate("/")
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
                    <label>Password:</label>
                    <div>

                        <input type={open ? 'text' : "password"} name="password" placeholder='enterthe password' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <button onClick={eyeControlPassword} className='eye-icons'>{open ? <LuEye className='eye-ico' /> : <LuEyeOff className='eye-ico' />}</button>
                        {formik.errors.password && formik.touched.password ? <p>{formik.errors.password}</p> : null}

                    </div>
                </div>
                <div className='button-label'>

                    <button type="submit">Login</button>
                </div>

            </form>
            <div>
                <h3>Doesn't Have An Account ? <Link className='anchor-link' to="/register">Register</Link></h3>
            </div>
        </div>
    )
}

export default Login