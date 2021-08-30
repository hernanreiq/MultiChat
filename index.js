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
const SocketIO = require('socket.io');
const IO = SocketIO(server);

IO.on('connection', (socket)=>{
    console.log('A new user is connected', socket.id);
    
    socket.on('chat_message', (data) => {
        IO.sockets.emit('chat_message', data);
    });

    socket.on('chat_typing', (username) => {
        socket.broadcast.emit('chat_typing', username);
    });
});