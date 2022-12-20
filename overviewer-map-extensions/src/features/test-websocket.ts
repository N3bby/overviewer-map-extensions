export function testWebsocket() {

    const span = document.createElement('span')
    document.body.appendChild(span)

    const socket = new WebSocket('ws://localhost:8080/ws');
    socket.onopen = () => console.log('Socket opened!')
    socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log('Message received: ' + data)
        const position = data.position;
        const player = data.player;

        span.innerText = `${player} | x:${position.x.toFixed(2)} y: ${position.y.toFixed(2)} z:${position.z.toFixed(2)}`
    }

}
