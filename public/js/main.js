const chatForm = document.getElementById('chat-form');
const chatmesages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userlist = document.getElementById('users')

//GET USERNAME AND ROOMAME
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io();

//Sending username and room to server
socket.emit('joinRoom' , {username,room})

// WHAT TO DO WHEN YOU RECIEVE A MSG FROM SERVER
socket.on('message' , message => {
    // console.log(message);
    //FUNCTION FOR OUTPUT MSG (NOT PREDEFINED...WE HAVE TO WRITE)
    outputMessage(message);

    //For Scroll down on message
    chatmesages.scrollTop = chatmesages.scrollHeight;
})

//SUBMIT
chatForm.addEventListener('submit' , (e)=>{
    e.preventDefault(); // WHEN FORM SUBMITS PAGE RESETS. BUT WE DONT WANT THAT

    const msg = e.target.elements.msg.value;

    // SENDING TO SERVER 
    socket.emit('chatMessage' , msg);

    //To clear textbox after sending msg
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div); 
}

//Get Room ANd Users... (Side Bar)
socket.on('roomUsers' , ({ room , users }) => {
    outputRoomName(room);
    outputUsers(users);
});


function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userlist.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')} 
    `;
    console.log(users)
}
