import {minecraftServerAdapter} from '../adapter/minecraft-server/minecraft-server-adapter';
import {Config} from '../config';
import {PlayerList} from '../components/player-list';

export function playerListFeature(config: Config) {
    if(!config.playerList.enabled) return;
    minecraftServerAdapter.init(config.websocketUrl)

    const playerlist = new PlayerList(config.playerList.dimensionIcons, document.body);
    minecraftServerAdapter.players$.subscribe(({players}) => playerlist.setPlayers(players))
}
