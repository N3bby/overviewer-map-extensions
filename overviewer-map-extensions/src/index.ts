import {overviewer} from './adapter/overviewer/overviewer-adapter';
import {parseConfig} from './config';
import {removeCompassFeature} from './features/remove-compass';
import {enableOverlayOnMapLoadFeature} from './features/enable-overlay-on-map-load';
import {simulateDayNightCycleFeature} from './features/simulate-day-night-cycle';
import {dynamicPlayersFeature} from './features/dynamic-players';
import {followedPlayer, playerListFeature} from './features/player-list';

document.addEventListener('DOMContentLoaded', async () => {
    const config = await parseConfig();
    await overviewer.waitUntilReady()

    removeCompassFeature(config)
    playerListFeature(config)
    enableOverlayOnMapLoadFeature(
        config,
        (overlay) => {
            if(!overlay.followPlayerConfig) return false;
            return followedPlayer.player !== undefined
    })
    simulateDayNightCycleFeature(config)
    dynamicPlayersFeature(config)
});


