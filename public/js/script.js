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
            var message_value = message.value.replace(/\n/g, "<br>"); //SANEAMIENTO PARA RESPETARLOS SALTOS DE LINEA
            socket.emit('chat_message', {
                message: message_value,
                username: username
            });
            output.innerHTML += `<div class="my-1 ml-5">
                <div class="my_message rounded-left px-2 py-1 float-right">
                    <b>${username}</b>:<br>${message_value}
                </div>
            </div>
            <div class="clearfix"></div>
            `;
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
    output.innerHTML += `<div class="my-1 mr-5">
        <div class="user_message rounded-right px-2 py-1 float-left">
            <b>${data.username}</b>:<br>${data.message}
        </div>
    </div>
    <div class="clearfix"></div>
    `;
    actions.innerHTML = '';
});

//ENVIANDOLE AL SERVIDOR CUANDO UN USUARIO ESTÁ ESCRIBIENDO
message.addEventListener('keypress', aUserIsTyping);

function aUserIsTyping(){
    if(!username){
        createUsername();
    } else {
        socket.emit('chat_typing', username);
    }
}

//RECIBIENDO DEL SERVIDOR QUIEN ESTÁ ESCRIBIENDO (SI SOY YO NO ME LO DICE)
socket.on('chat_typing', function(username){
    actions.innerHTML = `<p class="typing mb-0 py-2 pl-2">
    ${username} is typing...
    </p>`;
});
