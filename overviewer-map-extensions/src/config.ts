import {overlayIdentifier, OverlayIdentifier} from './identifiers';
import axios from 'axios';
import {asType} from './util';

export type ConfigJson = {
    websocketUrl: string;
    removeCompass?: boolean
    overlays: Array<{
        world: string,
        render: string,
        overlayRender: string,
        enableWhenWorldIsLoaded?: boolean
        simulateDayNightCycle?: boolean
        followPlayerConfig?: {
            disableWhenPlayerUnderYLevel: number
        }
    }>,
    dynamicPlayers: {
        enabled: boolean,
        dimensionMapping: Array<{
            map: string
            dimension: string
        }>
    },
    playerList:{
        enabled: boolean,
        dimensionIcons: Record<string, string>
        enableFollowPlayer: boolean
    }
}

export type Config = {
    websocketUrl: string;
    removeCompass?: boolean
    overlays: Array<{
        identifier: OverlayIdentifier,
        enableWhenWorldIsLoaded?: boolean
        simulateDayNightCycle?: boolean,
        followPlayerConfig?: {
            disableWhenPlayerUnderYLevel: number
        }
    }>,
    dynamicPlayers: {
        enabled: boolean,
        dimensionMapping: Array<{
            map: string
            dimension: string
        }>
    },
    playerList:{
        enabled: boolean,
        dimensionIcons: Record<string, string>
        enableFollowPlayer: boolean
    }
}

const CONFIG_URL = 'overviewer-map-extensions-config.json';

export async function parseConfig(): Promise<Config> {
    const config = (await axios.get<ConfigJson>(CONFIG_URL)).data

    return asType<Config>({
        ...config,
        overlays: config.overlays.map((overlay) => ({
            ...overlay,
            identifier: overlayIdentifier(overlay.world, overlay.render, overlay.overlayRender),
        })),
    })
}