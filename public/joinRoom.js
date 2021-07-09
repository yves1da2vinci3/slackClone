function joinRoom(RoomName){
    //  on doit envoyer le nom au server
    nsSocket.emit('joinRoom',RoomName,(newNumberOfMembers) =>{
 // nous alons mettre a jour le nombre total lorsqu'on nous avons join la room
     document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
    })
     nsSocket.on('historyCatcUp',(history) => {
         console.log(history)
         const messageUrl = document.querySelector('#messages');
         messageUrl.innerHTML =  "";
         history.forEach(msg => {
             const newMsg = buildHTML(msg);
             const currrentMessages = messageUrl.innerHTML;
             messageUrl.innerHTML = currrentMessages + newMsg;
         });
         messageUrl.scrollTo(0,messageUrl.scrollHeight);
         
     })
     nsSocket.on('updateMembers',(updaterNumbersOfMembers) =>{
        document.querySelector('.curr-room-num-users').innerHTML = `${updaterNumbersOfMembers} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${RoomName}`;
     })

     let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input',(e)=>{
        console.log(e.target.value)
        let messages = Array.from(document.getElementsByClassName('message-text'));
        console.log(messages);
        messages.forEach((msg)=>{
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                // the msg does not contain the user search term!
                msg.style.display = "none";
            }else{
                msg.style.display = "block";
            }
        })
    })
}