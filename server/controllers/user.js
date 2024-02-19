const { Op } = require('sequelize');
const User = require('../modals/user')
const JWT = require('jsonwebtoken')

function findToken(id, name) {
    return JWT.sign({ username: name, userId: id }, "secretkey", { expiresIn: "24h" })
}
exports.verifyUser = async (req, res, next) => {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        console.log(username)
        let exist = await User.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next()
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

exports.register = async (req, res) => {

    try {
        console.log(req.body)
        const { email, username, password } = req.body
        const exitsUsername = await new Promise(async (resolve, reject) => {
            const usernameExist = await User.findAll({ where: { username } })
            if (usernameExist.length > 0) {
                reject({ error: "please use unique username" })
            }
            resolve()
        })
        const exitsEmail = await new Promise(async (resolve, reject) => {
            const emailExist = await User.findAll({ where: { email } })
            if (emailExist.length > 0) {
                reject({ error: "please use unique Email" })
            }
            resolve()
        })
        Promise.all([exitsUsername, exitsEmail])
            .then(() => {
                if (password) {
                    User.create({ username: username, email: email, password: password })
                    return res.status(201).json({ msg: "user registartion succesfullly" })
                }
            }).catch(error => {
                return res.status(500).json({
                    error: { error }
                })
            })
    } catch (err) {
        return res.status(500).json({ err: err })
    }
}

exports.login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const existingEmail = await User.findAll({ where: { username } })
        if (existingEmail.length <= 0) {
            return res.status(500).json({ error: "user's doesn't exist" })
        }
        else {
            if (existingEmail[0].password !== password) {
                return res.status(500).json({ error: "incorrect password" })
            }
            else if (existingEmail[0].password === password) {
                return res.status(200).json({ message: "user login succesfully", token: findToken(existingEmail[0].id, existingEmail[0].username) })
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
}
exports.setUserAvatar = async (req, res, next) => {
    try {
        console.log(req.params)
        const userId = req.params.id
        const avatarImage = req.body.image;
        const body = {
            isAvatarImageSet: true,
            avatarImage
        }
        if (userId) {
            User.update(body, { where: { id: userId } }).then(() => {
                User.findAll({ where: { id: userId } }).then((user) => {
                    return res.status(201).json({ isSet: user[0].isAvatarImageSet, image: user[0].avatarImage });
                }).catch((err) => {
                    return res.status(400).json({ msg: "some thechnical issue with your data" })
                })

            }).catch((err) => {
                return res.status(401).json({ msg: "Authentication Error" })
            })
        }


    }
    catch (err) {
        next(err)
    }
}
exports.getAllUsers = async (req, res, next) => {
    try {
        console.log(req.params)
        const loginUsers = await User.findAll({ where: { id: +req.params.id }, attributes: ['id', 'username', 'email', 'isAvatarImageSet', 'avatarImage'] })
        const users = await User.findAll({ where: { id: { [Op.ne]: +req.params.id } }, attributes: ['id', 'username', 'email', 'avatarImage'] })
        return res.status(200).json({ loginusers: loginUsers[0], users })
    } catch (err) {
        next(err)
    }
}