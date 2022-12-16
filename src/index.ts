import {overviewer} from './adapter/overviewer/overviewer-adapter';
import {parseConfig} from './config';
import {DimensionIdentifier} from './identifiers';
import {wait} from './util';

document.addEventListener('DOMContentLoaded', async () => {
    const configPromise = parseConfig();
    await overviewer.waitUntilReady()

    const config = await configPromise

    if(config.removeCompass) {
        overviewer.removeCompass()
    }

    function mapChangedHandler(dimensionIdentifier: DimensionIdentifier) {
        config.overlays
            .filter(overlay => overlay.identifier.getDimensionIdentifier() == dimensionIdentifier.getDimensionIdentifier())
            .filter(overlay => overlay.enableWhenWorldIsLoaded)
            .forEach(async (overlay) => {
                await wait(250) // Defer until map is fully zoomed in
                overviewer.enableOverlay(overlay.identifier)
            })
    }
    overviewer.onMapChange(mapChangedHandler)
    mapChangedHandler(overviewer.getCurrentDimension())

});

