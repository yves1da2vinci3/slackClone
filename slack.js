const express = require('express');
const app = express();
const socketio = require('socket.io')
const ip= require('ip')
const ipAddress = ip.address()
app.use(express.static(__dirname + '/public'));

let namespaces = require('./data/namespaces');
console.log(namespaces)
  
const expressServer = app.listen(9000,(req,res,next) => {
    console.log('listening to port 9000') 
    console.log(` Test it to a another matchine with http://${ipAddress}:9000 `)

});

//GET home page

app.get('/',(req,res,next) =>{
    res.sendFile(__dirname + '/' + 'public/chat.html')
})
const io = socketio(expressServer);


// io.on = io.of('/').on
io.on('connection',(socket)=>{
    console.log(`${socket.id} is newly connected`)
    // construire un tableau qui va retourner les img et lesendpoints pour chacun des namespace
    let NsData = namespaces.map( ns => {
        return {
            img : ns.img,
            endpoint : ns.endpoint
        }
    })
//   envoie des infos au client
   socket.emit('nsList',NsData);

})

namespaces.forEach((namespace) =>{
    io.of(namespace.endpoint).on('connection',(nsSocket) =>{
        const userName = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
        nsSocket.emit('nsRoomLoad',namespace.rooms);
        nsSocket.on('joinRoom',(roomToJoin,numberOfUsersCallback) =>{
            // gerer les historiques s'il  y en a .
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            UpdateNumMembers(namespace,roomToLeave);
            nsSocket.join(roomToJoin);
            // io.of('/wiki').in(roomToJoin).clients((error,clients) => {
            //     console.log(clients.length);
            //     numberOfUsersCallback(clients.length);
            // })
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            })
             console.log(nsRoom.history)
             nsSocket.emit('historyCatcUp',nsRoom.history)
            //  nous envoyer le nombre d'utilisateurs dans la room a tout les sockets connectes a la chambre
            UpdateNumMembers(namespace,roomToJoin);
            // io.of(namespace.endpoint).in(roomToJoin).clients((err,clients) => {
            //     io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length)
            // })
        })
        // function qui permet de mettre a jour le nombre de users
      

        nsSocket.on('newMessageToServer',(msg) =>{
            const fullMsg = {
                text :msg.text,
                time : Date.now(),
                userName :userName,
                avatar : 'https://via.placeholder.com/30'
            }
            console.log(msg);
            // nous allons envoyer a tout les sockets qui sont dans la room ou ce socket est . 
            // l'uilisateur sera dans la seconde chambre parceque 
            // le socket se connecte toujours dans sa propre chambre dna la connexion
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // on doit parcourir le namespace pour trouver la room a laquelle correspond la room qui vient
            // detre rejoint
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            })
            console.log(" l'objet room que vous avons cree correspond a la chambre de NS");
            console.log(nsRoom);
            nsRoom.addMessage(fullMsg); 
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg)
        })
    })
})
function UpdateNumMembers(namespace,RoomName){
    io.of(namespace.endpoint).in(RoomName).clients((err,clients) => {
        io.of(namespace.endpoint).in(RoomName).emit('updateMembers',clients.length)
    }) 
}