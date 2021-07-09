function joinNs (endpoint){

   if(nsSocket){
       nsSocket.close();
       document.querySelector('#user-input').removeEventListener('submit',FormSubmission)
   }
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad',(nsRooms =>{
     let roomList = document.querySelector('.room-list');
     roomList.innerHTML = '';
     nsRooms.forEach(roomInfo =>{
         let glyph;
         if(roomInfo.privateRoom){
             glyph = 'lock';
         }else{
             glyph ='globe';
         }
         console.log(nsRooms)
    roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${roomInfo.roomTitle}</li>`
    })
    let roomNodes =document.getElementsByClassName('room');
    Array.from(roomNodes).forEach( elt =>{
        elt.addEventListener('click', (e) =>{
            console.log('someone clicked on ',e.target.innerText)
            joinRoom(e.target.innerText)
        })
    })
    const topRoom = document.querySelector('.room')
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
    }))
   
    

    document.querySelector('.message-form').addEventListener('submit',FormSubmission)
    
    function FormSubmission (event){
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer',{text: newMessage})
    }
    nsSocket.on('messageToClients',(msg)=>{

        console.log(msg)
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg;
    })
}



function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
    <li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
        <div class="user-name-time">${msg.userName} <span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>
    `
    return newHTML;
}