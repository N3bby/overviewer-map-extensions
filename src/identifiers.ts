export class DimensionIdentifier {

    constructor(private identifier: string) {
    }

    getDimensionIdentifier() {
        return this.identifier
    }

}

export function dimensionIdentifier(world: string, render: string) {
    return new DimensionIdentifier(`${world} - ${render}`)
}

export class OverlayIdentifier extends DimensionIdentifier {

    constructor(dimensionIdentifier: string,
                        private overlayRender: string) {
        super(dimensionIdentifier);
    }

    getOverlayIdentifier() {
        return this.overlayRender;
    }

}

export function overlayIdentifier(world: string, render: string, overlayRender: string) {
    return new OverlayIdentifier(
        dimensionIdentifier(world, render).getDimensionIdentifier(),
        overlayRender
    )
}