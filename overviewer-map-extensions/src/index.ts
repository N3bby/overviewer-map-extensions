import {overviewer} from './adapter/overviewer/overviewer-adapter';
import {parseConfig} from './config';
import {removeCompassFeature} from './features/remove-compass';
import {enableOverlayOnMapLoadFeature} from './features/enable-overlay-on-map-load';
import {testWebsocket} from './features/test-websocket';

document.addEventListener('DOMContentLoaded', async () => {
    const config = await parseConfig();
    // await overviewer.waitUntilReady()

    // removeCompassFeature(config)
    // enableOverlayOnMapLoadFeature(config)
    testWebsocket()
});

