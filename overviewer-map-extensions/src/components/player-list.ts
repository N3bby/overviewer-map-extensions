import {Player} from '../adapter/minecraft-server/messages/players-message';
import {isEqual, omit} from 'lodash';

export class PlayerList {

    private players: Player[] = [];
    private elementRef: HTMLElement | undefined

    constructor(private dimensionIcons: Record<string, string>, private parent: HTMLElement) {
        this.render()
    }

    render() {
        const newElement = document.createElement('div');
        newElement.classList.add('overviewer-map-ext');
        newElement.classList.add('online-player-list');

        const title = document.createElement('h2');
        title.innerText = 'Online players'
        newElement.appendChild(title)

        this.players
            .map(player => new PlayerEntry(this.dimensionIcons, player))
            .map(entry => entry.render())
            .forEach(entry => newElement?.appendChild(entry))

        this.elementRef?.remove()
        this.parent.appendChild(newElement)
        this.elementRef = newElement
    }

    setPlayers(players: Player[]) {
        const shouldRerender = !isEqual(
            this.players.map(player => ({...player, position: undefined })),
            players.map(player => ({...player, position: undefined })),
        );
        if(shouldRerender) {
            this.players = players;
            console.log('render')
            this.render()
        }
    }

}

class PlayerEntry {

    constructor(private dimensionIcons: Record<string, string>, private player: Player) {
    }

    render(): HTMLElement {
        const playerEntry = document.createElement('div')
        playerEntry.classList.add('player-entry')

        const playerImage = document.createElement('img')
        playerImage.classList.add('player-icon')
        playerImage.setAttribute('src', `https://crafatar.com/avatars/${this.player.id}`)
        playerEntry.appendChild(playerImage)

        const playerName = document.createElement('span')
        playerName.innerText = this.player.name
        playerEntry.appendChild(playerName)

        const dimensionImage = document.createElement('img')
        dimensionImage.classList.add('dimension-icon')
        dimensionImage.setAttribute('src', this.dimensionIcons[this.player.dimension] || '')
        playerEntry.appendChild(dimensionImage)

        return playerEntry
    }

}