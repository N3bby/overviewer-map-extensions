import {Config} from '../config';
import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';

export function dynamicPlayersFeature(config: Config) {
    if(!config.dynamicPlayers.enabled) return;
    minecraftServerAdapter.init(config.websocketUrl)


}
