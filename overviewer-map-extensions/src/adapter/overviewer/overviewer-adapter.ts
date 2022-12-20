import {DimensionIdentifier, OverlayIdentifier} from '../../identifiers';

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
}

export const overviewer = new OverviewerAdapter()