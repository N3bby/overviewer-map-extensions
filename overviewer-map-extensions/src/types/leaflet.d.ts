import {LatLng, Marker, MarkerOptions} from 'src/leaflet';

declare module 'leaflet' {

    namespace Marker {
        let movingMarker: (latlngs: LatLng[], durations: number[], options: MarkerOptions) => MovingMarker;
    }

    export interface MovingMarker extends Marker {
        moveTo(latlng: LatLng, duration: number): void;
    }

}