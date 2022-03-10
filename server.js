const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express();

const server = http.createServer(app);
const io = socketio(server)

const formatmessage = require('./utils/messages')
const {userJoin , getCurrentUser , userleave , getRoomUsers , users} = require('./utils/users')
//WHEN A CLIENT CONNECT
io.on('connection',socket => {
    
    socket.on('joinRoom',({username , room}) =>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        //TO EVERYONE
    socket.emit('message' ,formatmessage('Bot','Welcome to ChatCod'))
    console.log(users)

    //WHEN USER JOINS
    //BROADCAST==>SHOW EVERYONE EXCEPT SELF
    //to(user.room) ==> otherwise message will go to everyroom
    socket.broadcast.to(user.room).emit('message' ,formatmessage('Bot',`${user.username} HAS JOINED!`) );


    //SEND USER AND ROOM INFO
    io.to(user.room).emit('roomUsers' , {
      room : user.room,
      users : getRoomUsers(user.room)
    });
    })
    
    //WHEN USER LEAVES
    socket.on('disconnect', () => {
        const user = userleave(socket.id);
    
        if (user) {
          io.to(user.room).emit(
            'message',
            formatmessage('Bot', `${user.username} has left the chat!`)
          );
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
      });

    //CHAT MESSAGE LISTEN
    socket.on('chatMessage' , msg =>{

        // const user = userleave(socket.id)
        const user = getCurrentUser(socket.id);

        if(user){ io.emit('message' , formatmessage(`${user.username}`,msg));}

    })

    
})

app.use(express.static(path.join(__dirname , 'public')))
const PORT = 3000
server.listen(PORT , ()=>{
    console.log(`Server Running on ${PORT}`)
});

