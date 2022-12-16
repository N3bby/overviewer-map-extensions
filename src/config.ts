import {overlayIdentifier, OverlayIdentifier} from './identifiers';
import axios from 'axios';
import {asType} from './util';

export type ConfigJson = {
    removeCompass?: boolean
    overlays: Array<{
        world: string,
        render: string,
        overlayRender: string,
        enableWhenWorldIsLoaded?: boolean
        simulateDayNightCycle?: boolean
    }>
}

export type Config = {
    removeCompass?: boolean
    overlays: Array<{
        identifier: OverlayIdentifier,
        enableWhenWorldIsLoaded?: boolean
        simulateDayNightCycle?: boolean
    }>
}

const CONFIG_URL = 'overviewer-map-extensions-config.json';

export async function parseConfig(): Promise<Config> {
    const config = (await axios.get<ConfigJson>(CONFIG_URL)).data
    return asType<Config>({
        removeCompass: config.removeCompass,
        overlays: config.overlays.map((overlay) => ({
            identifier: overlayIdentifier(overlay.world, overlay.render, overlay.overlayRender),
            enableWhenWorldIsLoaded: overlay.enableWhenWorldIsLoaded,
            simulateDayNightCycle: overlay.simulateDayNightCycle
        }))
    })
}