// ============ FRONT END WEBSOCKET !!! =======

const messagesDiv = document.getElementById('chatroom-inner')
const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

let socket = null
let localStream = null
let peerConnection = null
let iceCandidateQueue = []



export function initializeSocket() {

    console.log("Attempting to connect to WSS..."); // this to confirm function runs

    socket = new WebSocket('wss://192.168.100.3:8000/') // create the connection to the websocket server written in server.js

    const configuration = {
        iceServers: [{ urls: "stun:stun1.l.google.com:5349" }]
    }

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


            if (data.type === 'chat' && data.user === 'system') {

                const msg = document.createElement('div')
                msg.innerHTML = `<strong>${data.user}:</strong> ${data.text}` // contains the message from the server

                messagesDiv.appendChild(msg)
                messagesDiv.scrollTop = messagesDiv.scrollHeight // Auto-scroll to bottom
            }

            else if (data.type === 'chat' && data.user !== 'system') {

                displayMessage(data.user, data.text, data.timestamp)
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

function displayMessage(user, text, time) {

    const msg = document.createElement('div')
    msg.innerHTML = `
    <span class="chat-time">${time} |</span>
    <strong>${user}:</strong> ${text}
    ` // contains the message from the server

    messagesDiv.appendChild(msg)
    messagesDiv.scrollTop = messagesDiv.scrollHeight // Auto-scroll to bottom
}





// ========== WebRTC LOGIC HERE ========

export async function startCamera() {
    try {
        const constraints = { 'video': true, 'audio': true }

        // wait for the user to give permission
        localStream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('got mediaStream: ', localStream)

        // fnd the video element
        localVideo.srcObject = localStream


    } catch (err) {
        console.error('error accesing media devices: ', err)
    }
}


// PEER CONNECTION SETUP 
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration)

    // when the browser find a conneciton path (ice candidate), send it to the other person
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({ candidate: event.candidate }))
        }
    }

    // when the remote stream arrives, show it in the remote video tag
    peerConnection.ontrack = (event) => {
        console.log('got remote track: ', event.stream[0])
        remoteVideo.srcObject = event.streams[0]
    }


}


// THE HANDSHAKE

// this runs when i click the call button
export async function initiateCall(e) {

    e.preventDefault()
    console.log('call btn pressed')

    createPeerConnection()
    console.log('creating peer connection...')

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log('sending offer...')
    socket.send(JSON.stringify({ offer: offer }))

}

export async function hangUpCall(e) {

    e.preventDefault()

    console.log('hanging up the call...')

    // run the cleanup locally
    if (peerConnection) {
        peerConnection.close()
        peerConnection = null 
    }

    remoteVideo.srcObject = null 

    iceCandidateQueue = []

    // tell the other person via the websocket
    socket.send(JSON.stringify({ type: 'hangup' }))

}
