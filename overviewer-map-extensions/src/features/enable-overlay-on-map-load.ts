import {Config} from '../config';
import {DimensionIdentifier} from '../identifiers';
import {wait} from '../util';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';

export function enableOverlayOnMapLoadFeature(config: Config) {
    function mapChangedHandler(currentDimension: DimensionIdentifier) {
        config.overlays
            .filter(overlay => overlay.identifier.getDimensionIdentifier() == currentDimension.getDimensionIdentifier())
            .filter(overlay => overlay.enableWhenWorldIsLoaded)
            .forEach(async (overlay) => {
                await wait(250) // Defer until map is fully zoomed in
                overviewer.enableOverlay(overlay.identifier)
            })
    }

    overviewer.onMapChange(mapChangedHandler)
    mapChangedHandler(overviewer.getCurrentDimension())
}