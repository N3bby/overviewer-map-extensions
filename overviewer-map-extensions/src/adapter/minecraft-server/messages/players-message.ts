import {Message} from './message';

export type PlayerMessage = {
    type: 'PLAYERS'
    players: Player[]
}

export type Player = {
    id: string,
    name: string,
    position: {
        x: number
        y: number
        z: number
    },
    dimension: string
}

export function isPlayerMessage(message: Message): message is PlayerMessage {
    return message.type === 'PLAYERS'
}
