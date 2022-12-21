import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';
import {Config} from '../config';
import {PlayerList} from '../components/player-list';
import {Player} from '../adapter/minecraft-server/messages/players-message';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';
import {DimensionIdentifier} from '../identifiers';

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
        let lastPositionUpdateTimestamp = new Date();
        let positionUpdateFrequencyInMs = 100;
        playerlist.followedPlayer$.subscribe((player) => {
            followedPlayer = player
        });
        minecraftServerAdapter.players$.subscribe(({players}) => {
            positionUpdateFrequencyInMs = new Date().getTime() - lastPositionUpdateTimestamp.getTime()
            lastPositionUpdateTimestamp = new Date();
            followedPlayerPosition = players.find(player => player.id === followedPlayer?.id)?.position
        })

        const centerMapOnPlayer = () => {
            if(followedPlayer && followedPlayerPosition) {
                const currentMap = overviewer.getCurrentDimension().getDimensionIdentifier()
                const playerMap = config.dynamicPlayers.dimensionMapping.find(mapping => mapping.dimension === followedPlayer?.dimension)?.map
                if(playerMap && currentMap !== playerMap) {
                    const zoom = overviewer.getZoom()
                    overviewer.changeMap(new DimensionIdentifier(playerMap))
                    // Timeout a workaround that is needed because overviewer stores/restores its own zoom level per map
                    // TODO Hook into overviewer.control.onChange function (it does overviewer.map.setView at the end)
                    setTimeout(() => overviewer.setZoom(zoom), 300);
                }
                overviewer.panTo(followedPlayerPosition, positionUpdateFrequencyInMs)
            }
            requestAnimationFrame(centerMapOnPlayer)
        }
        centerMapOnPlayer()
    }
}
