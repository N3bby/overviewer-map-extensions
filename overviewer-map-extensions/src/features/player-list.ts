import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';
import {Config} from '../config';
import {PlayerList} from '../components/player-list';
import {Player} from '../adapter/minecraft-server/messages/players-message';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';
import {DimensionIdentifier, overlayIdentifier} from '../identifiers';
import {over} from 'lodash';

const followedPlayer: { player: Player | undefined } = {
    player: undefined
}
export {followedPlayer}

export function playerListFeature(config: Config) {
    if (!config.playerList.enabled) return;
    minecraftServerAdapter.init(config.websocketUrl)

    const playerList = new PlayerList(
        config.playerList.dimensionIcons,
        document.body,
        config.playerList.enableFollowPlayer,
    );

    minecraftServerAdapter.players$.subscribe(({players}) => playerList.setPlayers(players))

    if (config.playerList.enableFollowPlayer) {
        let followedPlayerPosition: { x: number, y: number, z: number } | undefined
        let lastPositionUpdateTimestamp = new Date();
        let positionUpdateFrequencyInMs = 100;
        playerList.followedPlayer$.subscribe((player) => {
            followedPlayer.player = player
        });
        minecraftServerAdapter.players$.subscribe(({players}) => {
            positionUpdateFrequencyInMs = new Date().getTime() - lastPositionUpdateTimestamp.getTime()
            lastPositionUpdateTimestamp = new Date();
            followedPlayerPosition = players.find(player => player.id === followedPlayer.player?.id)?.position
        })

        const centerMapOnPlayer = () => {
            if (followedPlayer && followedPlayerPosition) {
                const currentMap = overviewer.getCurrentDimension().getDimensionIdentifier()
                const playerMap = config.dynamicPlayers.dimensionMapping.find(mapping => mapping.dimension === followedPlayer.player?.dimension)?.map

                if (playerMap && currentMap !== playerMap) {
                    const zoom = overviewer.getZoom()
                    overviewer.changeMap(new DimensionIdentifier(playerMap))
                    // Timeout a workaround that is needed because overviewer stores/restores its own zoom level per map
                    // TODO Hook into overviewer.control.onChange function (it does overviewer.map.setView at the end)
                    setTimeout(() => overviewer.setZoom(zoom), 300);
                }

                const applicableOverlays = config.overlays
                    .filter(overlay => overlay.identifier.getDimensionIdentifier() === currentMap)
                    .filter(overlay => overlay.followPlayerConfig)

                applicableOverlays
                    .filter(overlay => followedPlayerPosition!!.y < overlay.followPlayerConfig!!.disableWhenPlayerUnderYLevel)
                    .forEach(overlay => overviewer.disableOverlay(overlay.identifier))
                applicableOverlays
                    .filter(overlay => followedPlayerPosition!!.y > overlay.followPlayerConfig!!.disableWhenPlayerUnderYLevel)
                    .forEach(overlay => overviewer.enableOverlay(overlay.identifier))

                overviewer.panTo(followedPlayerPosition, positionUpdateFrequencyInMs)
            }
            requestAnimationFrame(centerMapOnPlayer)
        }
        centerMapOnPlayer()
    }
}
