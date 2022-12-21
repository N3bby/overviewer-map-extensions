import {Config} from '../config';
import {DimensionIdentifier, OverlayIdentifier} from '../identifiers';
import {wait} from '../util';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';

export function enableOverlayOnMapLoadFeature(config: Config, disabled: (overlay: { identifier: OverlayIdentifier, followPlayerConfig?: {disableWhenPlayerUnderYLevel: number}}) => boolean) {
    function mapChangedHandler(currentDimension: DimensionIdentifier) {
        config.overlays
            .filter(overlay => overlay.identifier.getDimensionIdentifier() == currentDimension.getDimensionIdentifier())
            .filter(overlay => overlay.enableWhenWorldIsLoaded)
            .forEach(async (overlay) => {
                if(!disabled(overlay)) {
                    await wait(250) // Defer until map is fully zoomed in
                    overviewer.enableOverlay(overlay.identifier)
                }
            })
    }

    overviewer.onMapChange(mapChangedHandler)
    mapChangedHandler(overviewer.getCurrentDimension())
}