import {BehaviorSubject, Observable} from 'rxjs';
import {isPlayerMessage, PlayerMessage} from './messages/players-message'
import {isTimeMessage, TimeMessage} from './messages/time-message';

class MinecraftServerAdapter {

    private socket: WebSocket | undefined

    private playersSubject = new BehaviorSubject<PlayerMessage>({type: 'PLAYERS', players: []});
    private timeSubject = new BehaviorSubject<TimeMessage>({type: 'TIME', time: 0});

    get players$(): Observable<PlayerMessage> {
        return this.playersSubject
    }

    get time$(): Observable<TimeMessage> {
        return this.timeSubject
    }

    init(websocketUrl: string) {
        if (this.socket) return;

        this.socket = new WebSocket(websocketUrl);

        this.socket.onopen = () => console.log('Websocket opened')
        this.socket.onclose = () => console.log('Websocket opened')

        this.socket.onmessage = (frame) => {
            const message = JSON.parse(frame.data);
            if (isPlayerMessage(message)) {
                this.playersSubject.next(message)
            } else if (isTimeMessage(message)) {
                this.timeSubject.next(message)
            } else {
                console.warn('Received unknown message from websocket.', message);
            }
        }
    }

}

export const minecraftServerAdapter = new MinecraftServerAdapter()