import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';
import {Config} from '../config';
import {PlayerList} from '../components/player-list';
import {Player} from '../adapter/minecraft-server/messages/players-message';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';

export function playerListFeature(config: Config) {
    if(!config.playerList.enabled) return;
    minecraftServerAdapter.init(config.websocketUrl)

    const playerlist = new PlayerList(
        config.playerList.dimensionIcons,
        document.body,
        config.playerList.enableFollowPlayer,
    );

    minecraftServerAdapter.players$.subscribe(({players}) => playerlist.setPlayers(players))

    if(config.playerList.enableFollowPlayer) {
        let followedPlayer: Player | undefined = undefined;
        let followedPlayerPosition: {x: number, y: number, z: number} | undefined
        playerlist.followedPlayer$.subscribe((player) => {
            followedPlayer = player
        });
        minecraftServerAdapter.players$.subscribe(({players}) => {
            followedPlayerPosition = players.find(player => player.id === followedPlayer?.id)?.position
        })

        const centerMapOnPlayer = () => {
            if(followedPlayer && followedPlayerPosition) {
                overviewer.panTo(followedPlayerPosition)
            }
            requestAnimationFrame(centerMapOnPlayer)
        }
        centerMapOnPlayer()
    }
}
