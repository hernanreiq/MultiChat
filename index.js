const express = require('express');
const app = express();
const path = require('path');
//settings
const PORT = process.env.PORT || 3700;

//static files 
app.use(express.static(path.join(__dirname, 'public')));

//start the server
const server = app.listen(PORT, () => {
    console.log('Server is ready on port:', PORT);
});

//websockets
const Socketio = require('socket.io');
const io = Socketio(server);

io.on('connection', (socket)=>{
    var countUsers = io.engine.clientsCount;
    io.sockets.emit('users_online', countUsers);
    
    socket.on('chat_message', (data) => {
        io.sockets.emit('chat_message', data);
    });

    socket.on('chat_typing', (username) => {
        socket.broadcast.emit('chat_typing', username);
    });

    socket.on('disconnect', () => {
        io.sockets.emit('users_online', countUsers);
    });
});