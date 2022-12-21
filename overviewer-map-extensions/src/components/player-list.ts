import {Player} from '../adapter/minecraft-server/messages/players-message';
import {isEqual, omit} from 'lodash';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';

// TODO Replace with micro-frontend (Vue, React, ...?)
export class PlayerList {

    private players: Player[] = [];
    private elementRef: HTMLElement | undefined

    private children: { element: PlayerEntry, subscription: Subscription }[] = [];

    private followedPlayerSubject = new BehaviorSubject<Player | undefined>(undefined);

    get followedPlayer$(): Observable<Player | undefined> {
        return this.followedPlayerSubject
    }

    constructor(private dimensionIcons: Record<string, string>, private parent: HTMLElement, enableFollowPlayer: boolean) {
        this.render()
    }

    render() {
        const newElement = document.createElement('div');
        newElement.classList.add('overviewer-map-ext');
        newElement.classList.add('online-player-list');

        const title = document.createElement('h2');
        title.innerText = 'Players'
        newElement.appendChild(title)

        this.children.forEach(child => child.element.destroy());
        this.children.forEach(child => child.subscription.unsubscribe());

        if (this.players.length === 0) {
            const noPlayersMessage = document.createElement('div')
            noPlayersMessage.classList.add('no-players-online')
            noPlayersMessage.innerText = "No players are online"
            newElement.appendChild(noPlayersMessage);
        } else {
            this.players
                .map(player => {
                    const playerEntry = new PlayerEntry(this.dimensionIcons, player, this.followedPlayer$)
                    const subscription = playerEntry.click$.subscribe(() => {
                        if (this.followedPlayerSubject.value === player) {
                            this.followedPlayerSubject.next(undefined)
                        } else {
                            this.followedPlayerSubject.next(player)
                        }
                    });
                    return {element: playerEntry, subscription}
                })
                .map(entry => entry.element.render())
                .forEach(htmlElement => newElement.appendChild(htmlElement))
        }

        this.elementRef?.remove()
        this.parent.appendChild(newElement)
        this.elementRef = newElement
    }

    setPlayers(players: Player[]) {
        const shouldRerender = !isEqual(
            this.players.map(player => ({...player, position: undefined})),
            players.map(player => ({...player, position: undefined})),
        );
        if (shouldRerender) {
            this.players = players;
            console.log('render')
            this.render()
        }
    }

}

class PlayerEntry {

    private clickSubject = new Subject<void>();
    private elementRef: HTMLElement | undefined;
    private followedPlayerSubscription: Subscription;

    get click$(): Observable<void> {
        return this.clickSubject
    }

    constructor(
        private dimensionIcons: Record<string, string>,
        private player: Player,
        followedPlayer$: Observable<Player | undefined>
    ) {
        this.followedPlayerSubscription = followedPlayer$.subscribe((followedPlayer) => {
            if (this.player === followedPlayer) {
                this.elementRef?.classList.add('followed')
            } else {
                this.elementRef?.classList.remove('followed')
            }
        })
    }

    render(): HTMLElement {
        this.elementRef = document.createElement('div')
        this.elementRef.classList.add('player-entry')
        this.elementRef.addEventListener('click', () => this.clickSubject.next())

        const playerImage = document.createElement('img')
        playerImage.classList.add('player-icon')
        playerImage.setAttribute('src', `https://crafatar.com/avatars/${this.player.id}`)
        this.elementRef.appendChild(playerImage)

        const playerName = document.createElement('span')
        playerName.innerText = this.player.name
        this.elementRef.appendChild(playerName)

        const dimensionImage = document.createElement('img')
        dimensionImage.classList.add('dimension-icon')
        dimensionImage.setAttribute('src', this.dimensionIcons[this.player.dimension] || '')
        this.elementRef.appendChild(dimensionImage)

        return this.elementRef
    }

    destroy() {
        this.followedPlayerSubscription.unsubscribe()
    }

}