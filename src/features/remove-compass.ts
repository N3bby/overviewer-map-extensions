import {Config} from '../config';
import {overviewer} from '../adapter/overviewer/overviewer-adapter';

export function removeCompassFeature(config: Config) {
    if(config.removeCompass) {
        overviewer.removeCompass()
    }
}