import axios from "axios"
import { jwtDecode } from "jwt-decode"
axios.defaults.baseURL = "http://localhost:4000"

// decode the token of the jwt
export async function decodeUserToken() {
    const token = localStorage.getItem('token')
    if (!token) return Promise.reject("login the app");
    let decode = jwtDecode(token)
    return decode;
}

// for the new user first time come to the app
export async function registerUser(values) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, values)
        return Promise.resolve(msg)
    }
    catch (error) {
        let err = error.response.data.err.error
        return Promise.reject(err)
    }
}

// already the customer who wants to login the app
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        let err = error.response.data.error
        return Promise.reject({ err })
    }
}

// setAvatar

export async function avatarSetUser({ id, image }) {
    const token = await localStorage.getItem('token');
    const { data } = await axios.post(`/api/setAvatar/${id}`, {
        image,
    }, { headers: { "Authorization": `Bearer ${token}` } })
    return data
}

//get all user from database
export async function allUsersRoute(id) {
    const token = await localStorage.getItem('token');
    const data = await axios.get(`/api/allusers/${id}`,
        { headers: { "Authorization": `Bearer ${token}` } })
    return data
}


// to send message to databse

export async function sendMsgRoute(messageData) {
    const token = await localStorage.getItem('token');
    await axios.post('/api/addmsg', messageData, { headers: { "Authorization": `Bearer ${token}` } })
}

// to get messages from database

export async function getMsgRoute(messageInfo) {
    console.log(messageInfo)
    const token = await localStorage.getItem('token');
    const data = await axios.post('/api/getmsg', messageInfo, { headers: { "Authorization": `Bearer ${token}` } })
    return data
}