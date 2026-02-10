// ============ FRONT END WEBSOCKET !!! =======


let socket = null
const messagesDiv = document.getElementById('chatroom-inner')

export function initializeSocket() {
    
    console.log("Attempting to connect to WSS..."); // this to confirm function runs

    socket = new WebSocket('wss://192.168.100.3:8000/') // create the connection to the websocket server written in server.js

    // this event fires once when the connection is successfully established
    socket.addEventListener('open', (event) => {
        console.log('WEBSOCKET CONNECTION ESTABLISHED')
    })

    socket.addEventListener('error', (event) => {
        console.error("WebSocket Error Observed:", event);
    });


    socket.addEventListener('message', (event) => {
        try {

            const data = JSON.parse(event.data)

            if (data.type === 'chat') {
                const msg = document.createElement('div')
                // data.user comes from the server's session data
                msg.innerHTML = `<strong>${data.user}:</strong> ${data.text}`
                messagesDiv.appendChild(msg)
                messagesDiv.scrollTop = messagesDiv.scrollHeight
            }
            

        } catch (err) {
            console.error('error parsing message: ', err)
        }
    })

}


export function sendChatMessage(jsonString) {

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(jsonString)
    } else {
        console.error("socket not connected")
    }

}



