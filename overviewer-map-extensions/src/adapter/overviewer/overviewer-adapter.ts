import {DimensionIdentifier, OverlayIdentifier} from '../../identifiers';
import {LatLng, Marker} from 'leaflet';

export class OverviewerAdapter {

    get overviewer(): Record<string, any> {
        return (window as any).overviewer;
    }

    async waitUntilReady() {
        return new Promise(resolve => {
            const resolveWhenReady = () => {
                if (this.overviewer !== undefined && this.overviewer.map !== null) {
                    resolve(undefined);
                } else {
                    setTimeout(resolveWhenReady, 50)
                }
            }
            resolveWhenReady();
        });
    }

    enableOverlay(overlayIdentifier: OverlayIdentifier) {
        const overlayCollection = this.overviewer.collections.overlays[overlayIdentifier.getDimensionIdentifier()][overlayIdentifier.getOverlayIdentifier()];

        const overlayName = overlayCollection.tileSetConfig.name;

        const layerControlInputs = this.overviewer.layerCtrl._layerControlInputs as Array<any>;
        const layerControlInputForOverlay: HTMLInputElement | undefined = layerControlInputs
            .find(layerControlInput => {
                let labels = Array.from(layerControlInput.labels as NodeList);
                return labels.find((label: Node) => {
                    const span = (label as HTMLElement).getElementsByTagName('span')[0];
                    return span?.innerText.trim() === overlayName
                })
            });

        if (layerControlInputForOverlay) {
            layerControlInputForOverlay.click()
        }
    }

    setOverlayOpacity(overlayIdentifier: OverlayIdentifier, opacity: number) {
        const overlay = this.overviewer.collections.overlays
            [overlayIdentifier.getDimensionIdentifier()]
            [overlayIdentifier.getOverlayIdentifier()];

        overlay.setOpacity(opacity);
    }

    removeCompass() {
        this.overviewer.compass.remove()
    }

    getCurrentDimension(): DimensionIdentifier {
        return new DimensionIdentifier(this.overviewer.current_world);
    }

    onMapChange(listener: (dimensionIdentifier: DimensionIdentifier) => void) {
        (this.overviewer.worldCtrl.select as HTMLInputElement).addEventListener('input', (event: Event) => {
            const selectElement = event.target as HTMLSelectElement;
            listener(new DimensionIdentifier(selectElement.value))
        })
    }

    changeMap(playerMap: DimensionIdentifier) {
        const select = this.overviewer.worldCtrl.select as HTMLSelectElement
        select.value = playerMap.getDimensionIdentifier();
        (select as any).onchange({target: select})
    }

    calculateLatNg(mapIdentifier: DimensionIdentifier, position: { x: number, y: number, z: number }): LatLng {
        const map = this.overviewer.collections.mapTypes[mapIdentifier.getDimensionIdentifier()]

        const renderKey = Object.keys(map)[0]!
        const render = map[renderKey]

        const zoomLevels = render.tileSetConfig.zoomLevels;
        return this.overviewer.util.fromWorldToLatLng(
            position.x,
            position.y,
            position.z,
            {
                zoomLevels: zoomLevels,
                north_direction: 0,
            },
        ) as LatLng;
    }

    addMarker(marker: Marker) {
        marker.addTo(this.overviewer.map)
    }

    removeMarker(marker: Marker) {
        this.overviewer.map.removeLayer(marker);
    }

    panTo(position: {x: number, y: number, z: number}, durationInMs: number) {
        const latNg = this.calculateLatNg(this.getCurrentDimension(), position)
        this.overviewer.map.panTo(latNg, {animate: true, duration: durationInMs / 1000, easeLinearity: 1})
    }

    getZoom(): number {
        return this.overviewer.map.getZoom();
    }

    setZoom(zoom: number) {
        this.overviewer.map.setZoom(zoom);
    }
}

export const overviewer = new OverviewerAdapter()