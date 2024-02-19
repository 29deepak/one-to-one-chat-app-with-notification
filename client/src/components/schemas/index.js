import * as Yup from 'yup'
// const password = "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$"
export const registerSchema = Yup.object({
    username: Yup.string().min(2).max(60).required("please Enter your username"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("please enter your password"),
    confirmpassword: Yup.string().required().oneOf([Yup.ref("password"), null], "Password must match")

})

// password: Yup.string().min(6).required("please enter your password").matches(password, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),


export const loginSchema = Yup.object({
    username: Yup.string().min(2).max(60).required("please Enter your username"),
    password: Yup.string().min(6).required("password must be at least 6 character"),

})