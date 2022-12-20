import {overviewer} from './adapter/overviewer/overviewer-adapter';
import {Config, parseConfig} from './config';
import {removeCompassFeature} from './features/remove-compass';
import {enableOverlayOnMapLoadFeature} from './features/enable-overlay-on-map-load';
import {simulateDayNightCycleFeature} from './features/simulate-day-night-cycle';
import {dynamicPlayersFeature} from './features/dynamic-players';

document.addEventListener('DOMContentLoaded', async () => {
    const config = await parseConfig();
    await overviewer.waitUntilReady()

    removeCompassFeature(config)
    enableOverlayOnMapLoadFeature(config)
    simulateDayNightCycleFeature(config)
    dynamicPlayersFeature(config)
});


