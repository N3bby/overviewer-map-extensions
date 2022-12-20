import {Message} from './message';

export type TimeMessage = {
    type: 'TIME'
    time: number
}

export function isTimeMessage(message: Message): message is TimeMessage {
    return message.type === 'TIME'
}