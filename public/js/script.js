const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

//DOM
var btn_send = document.getElementById('send');
var message = document.getElementById('message');
var actions = document.getElementById('actions');
var output = document.getElementById('output');

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

// ENVÍO DE MENSAJES
btn_send.addEventListener('click', sendMessage);

async function sendMessage(){
    console.log({
        username: username,
        message: message.value
    });
    message.value = '';
}