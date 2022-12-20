import {Config} from '../config';
import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';
import type {Icon, icon as createIcon, Marker, MovingMarker} from 'leaflet';
import {LatLng} from 'leaflet';
import {Player} from '../adapter/minecraft-server/messages/players-message';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';

export function dynamicPlayersFeature(config: Config) {
    if(!config.dynamicPlayers.enabled) return;
    minecraftServerAdapter.init(config.websocketUrl)

    const markers: Record<string, MovingMarker> = {}

    let lastUpdateTimestamp = new Date();
    let updateFrequencyInMs = 100;

    minecraftServerAdapter.players$.subscribe(({players}) => {
        updateFrequencyInMs = new Date().getTime() - lastUpdateTimestamp.getTime()
        lastUpdateTimestamp = new Date();

        let playersToShow: Player[] = [];
        const dimensionMapping = config.dynamicPlayers.dimensionMapping
            .find(mapping => mapping.map === overviewer.getCurrentDimension().getDimensionIdentifier())
        if(dimensionMapping) {
            playersToShow = players.filter(player => player.dimension === dimensionMapping.dimension);
        } else {
            console.warn('No dimension mapping found for current map. No players will be shown')
        }

        const newPlayers = findNewPlayers(playersToShow, Object.keys(markers))
        const removedPlayers = findRemovedPlayers(playersToShow, Object.keys(markers))

        createNewPlayerMarkers(markers, newPlayers)
        deletePlayerMarkers(markers, removedPlayers)
        updatePlayerMarkers(markers, playersToShow, updateFrequencyInMs)
    })
}

function findNewPlayers(players: Player[], playerMarkerNames: string[]): Player[] {
    return players.filter(player => !playerMarkerNames.includes(player.name))
}

function findRemovedPlayers(players: Player[], playerMarkerNames: string[]): string[] {
    return playerMarkerNames.filter(playerMarkerName => !players.find(player => player.name === playerMarkerName))
}

function createNewPlayerMarkers(markers: Record<string, MovingMarker>, newPlayers: Player[]) {
    newPlayers.forEach(player => {
        const icon = getAvatarIcon(player)
        const position = overviewer.calculateLatNg(overviewer.getCurrentDimension(), player.position)

        const marker = createMovingMarker(position, player.name, icon);
        overviewer.addMarker(marker)
        markers[player.name] = marker;
    })
}

function deletePlayerMarkers(markers: Record<string, MovingMarker>, playerNames: string[]) {
    playerNames.forEach(name => {
        const marker = markers[name];
        if(marker) {
         overviewer.removeMarker(marker)
        }
        delete markers[name];
    })
}

function updatePlayerMarkers(markers: Record<string, MovingMarker>, players: Player[], updateFrequencyInMs: number) {
    players.forEach(player => {
        const marker = markers[player.name]
        if(marker) {
            marker.moveTo(
                overviewer.calculateLatNg(overviewer.getCurrentDimension(), player.position),
                updateFrequencyInMs
            )
        }
    })
}

function createMovingMarker(position: LatLng, title: string, icon: Icon): MovingMarker {
    const createMovingMarkerFn = (window as any).L.Marker.movingMarker as typeof Marker.movingMarker;
    return createMovingMarkerFn([position], [], {title: title, icon});
}

function getAvatarIcon(player: Player) {
    const createIconFn = (window as any).L.icon as typeof createIcon;
    console.log('Fetching skin for ' + player.name)
    return createIconFn({
        iconUrl: `https://crafatar.com/renders/body/${player.id}?overlay=true&default=MHF_Steve`,
        iconSize: [38, 95],
        iconAnchor: [25, 85],
    });
}
