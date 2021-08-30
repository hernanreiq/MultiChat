const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

//DOM
var btn_send = document.getElementById('send');
var message = document.getElementById('message');
var actions = document.getElementById('actions');
var output = document.getElementById('output');
var users_online = document.getElementById('users-online');

//CREACION DEL NOMBRE DE USUARIO CON SWEET ALERT 2
var username;

async function createUsername(){
    while(!username){
        const { value: input_username } = await Swal.fire({
            icon: 'question',
            title: 'What is your username?',
            input: 'text',
            inputPlaceholder: 'Username',
            inputAttributes: {
              maxlength: 15,
              autocapitalize: 'off',
              autocorrect: 'off'
            }
        });
        if(input_username.length > 0){
            username = input_username;
        } else {
            createUsername();
        }
    }
}

createUsername();

//CONTABILIZACION DE USUARIOS CONECTADOS
socket.on('users_online', function(countUsers){
    if(countUsers == 1){
        users_online.innerHTML = 'There is <span class="badge badge-dark">1</span> user online';
    } else {
        users_online.innerHTML = `There are <span class="badge badge-dark">${countUsers}</span> users online`;
    }
});

// ENVÍO DE MENSAJES
btn_send.addEventListener('click', sendMessage);

function sendMessage(){
    if(!username){
        createUsername();
    } else {
        if((message.value).length > 0){
            socket.emit('chat_message', {
                message: message.value,
                username: username
            });
            message.value = '';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Write a message to send'
            });
        }
    }
}

// RECIBIENDO LOS DATOS Y PINTANDOLOS EN PANTALLA
socket.on('chat_message', function(data){
    output.innerHTML += `
    <p><strong>${data.username}</strong>: ${data.message}</p>
    `;
    actions.innerHTML = '';
});

//ENVIANDOLE AL SERVIDOR CUANDO UN USUARIO ESTÁ ESCRIBIENDO
message.addEventListener('keypress', aUserIsTyping);

function aUserIsTyping(){
    socket.emit('chat_typing', username);
}

//RECIBIENDO DEL SERVIDOR QUIEN ESTÁ ESCRIBIENDO (SI SOY YO NO ME LO DICE)
socket.on('chat_typing', function(username){
    actions.innerHTML = `<p class="typing">
    ${username} is typing...
    </p>`;
});
