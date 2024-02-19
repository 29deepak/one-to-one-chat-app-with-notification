const { Op } = require('sequelize');
const Message = require('../modals/message');

exports.addMsg = async (req, res, next) => {
    try {
        console.log(req.body)
        const { from, to, message } = req.body;
        const data = await Message.create({ message: { text: message }, to: to, userId: from })
        if (data) return res.status(201).json({ msg: "mssge added successfully" })
        return res.json({ msg: "failed to add message to the database" })
    } catch (err) {
        next(err)
    }
}
exports.getAllMsg = async (req, res, next) => {
    try {

        const { from, to } = req.body;
        const messages = await Message.findAll({ where: { [Op.or]: [{ to: to, userId: from }, { to: from, userId: to }] }, order: [['updatedAt', 'ASC']], attributes: ['id', 'message', 'to', 'updatedAt', 'userId'] })
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.userId === from,
                message: msg.message.text,
            }
        })
        console.log(projectMessages)
        return res.json(projectMessages)

    } catch (err) {
        next(err)
    }
}
