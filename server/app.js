const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./utils/database')
const socket = require("socket.io")
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

// routes
const userRoutes = require('./router/user')
const messagRoutes = require('./router/message')

//modals

const User = require('./modals/user');
const Message = require('./modals/message')

//use
app.use('/api', userRoutes)
app.use('/api', messagRoutes)

//join
User.hasMany(Message);
Message.belongsTo(User);

const server = http.createServer(app).listen(4000)





sequelize
    .sync()
    .then(() => {
        server
        // server.listen(4000, () => {
        //     console.log("server is connected succesfully")
        // })
    })
    .catch((err) => {
        console.log(err)
    })

const onlineUsers = new Map()
let findOnlineusers = []
const io = socket(server, {
    cors: "http://localhost:3000",
    credential: true
})
io.on("connection", (socket) => {
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
        !findOnlineusers.some((user) => user.userId == userId) &&
            findOnlineusers.push({
                userId,
                socketId: socket.id
            })
        io.emit("getOnlineUsers", findOnlineusers)
    })
    //----add-messages---------------------
    socket.on("send-msg", (data) => {
        console.log("dcndcn", data)
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit('msg-received', data.message);
            io.to(sendUserSocket).emit('get-notification', {
                senderId: data.from,
                isRead: false,
                date: new Date()
            });
        }
    })
    //--------------------------------------------------------------

    socket.on('disconnect', () => {
        console.log('User disconnected');
        findOnlineusers = findOnlineusers.filter(user => user.socketId !== socket.id)
        console.log(findOnlineusers)
        io.emit("getOnlineUsers", findOnlineusers)
    });

})