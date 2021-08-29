const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

//DOM
var btn_send = document.getElementById('send');
var message = document.getElementById('message');
var actions = document.getElementById('actions');
var output = document.getElementById('output');