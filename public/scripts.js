const userName = prompt(' what is your Name ?')
const socket = io('http://localhost:9000',{
  query : {
      username : userName
  }
}); // the / namespace/endpoint

let nsSocket = '';

socket.on('nsList',(nsData) =>{
    console.log('the list of namespace has arrived');
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
    });
    // add a click listener for each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach(elt =>{
        elt.addEventListener('click',(e) =>{
            e.preventDefault();
            const nsEndpoint = elt.getAttribute('ns');
            // console.log(nsEndpoint);
            joinNs(nsEndpoint);
        })
        
    })
    //se connecter wiki namespace
    joinNs('/wiki')
})







