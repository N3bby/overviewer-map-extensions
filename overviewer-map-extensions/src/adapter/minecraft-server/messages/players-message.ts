import {Message} from './message';

export type PlayerMessage = {
    type: 'PLAYERS'
    players: Player[]
}

export type Player = {
    player: string,
    position: {
        x: number
        y: number
        z: number
    }
}

export function isPlayerMessage(message: Message): message is PlayerMessage {
    return message.type === 'PLAYERS'
}
