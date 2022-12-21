# overviewer-map-extensions

## Table of contents

**[1. Features](https://github.com/N3bby/overviewer-map-extensions#1-features)**  
**[2. Installation](https://github.com/N3bby/overviewer-map-extensions#2-installation)**

## 1. Features
### Simulate day-night cycle
Simulates a day night cycle on the map by dynamically changing the opacity of night-time overlay.

https://user-images.githubusercontent.com/1220787/208959510-571d8dc8-a79b-41f8-a999-642e4d7a7c7b.mp4

### Dynamic player markers
Shows the position of all players in the current map.  
Skins are fetched from [Crafatar](https://crafatar.com/)

https://user-images.githubusercontent.com/1220787/208959670-635f1e15-ad18-4d6c-9048-018b0ebba43c.mp4

### Player list
Shows a list of all online players and in which dimension they are.

![player-list](https://user-images.githubusercontent.com/1220787/208956548-9148cd98-e575-47e4-a8f2-f7135ac815ab.png)

### Follow player
Allows you to click on a player in the player list to start following them.  
This will change the map if a player goes to another dimension.  
Click again to stop following the player.

https://user-images.githubusercontent.com/1220787/208959257-ee32d9d2-019a-459e-aefc-95ab602ed5a9.mp4

## 2. Installation

**overviewer-map-extensions** consists out of 2 modules:
- A fabric mod that exposes information via a websocket
- A typescript module that is loaded by a browser and adds all the features to the map

Neither of these modules are published anywhere, so you'll have to build them yourself

### I. Fabric mod

##### Requirements

- Java 17

##### Building
1. Go to the [overviewer-map-extensions-fabric](./overviewer-map-extensions-fabric) directory
2. Build the mod by running `./gradlew clean build`

##### Installing
1. Install [Fabric Language Kotlin](https://www.curseforge.com/minecraft/mc-mods/fabric-language-kotlin)
2. Copy `overviewer-map-extensions-fabric-1.0.0.jar` from the `./overviewer-map-extensions-fabric/build/libs/` directory to your fabric mod folder

When running your minecraft server, a web server will start listening for incoming connections.  
You should be able to connect to the websocket on `ws://<host>:8080/ws`

### II. Typescript module

##### Requirements

- Node.js 18.12.1

##### Building
1. Go to the [overviewer-map-extensions](./overviewer-map-extensions) directory
2. Run `npm install` to download all the dependencies
3. Duplicate the config template file in `./overviewer-map-extensions/assets/overviewer-map-extensions-config.template.json` and name it `overviewer-map-extensions-config.json`
4. Run `npm run build`

##### Installing
1. Copy the contents of the `./overviewer-map-extensions/dist/` directory to the root of your overviewer map directory (where the index.html is located)
2. Create a `overviewer-map-extensions-config.json` in the overviewer map directory. An example configuration file can be found [here](./overviewer-map-extensions/assets/overviewer-map-extensions-config.template.json)
If you load your map in a browser now, it will connect to the websocket that the fabric mod provides and add all the enabled features
