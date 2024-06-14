package by.n3b.overviewer_map_extensions

import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents
import net.minecraft.server.MinecraftServer

object ServerProvider: ServerTickEvents.EndTick {

    private var _server: MinecraftServer? = null

    val server: MinecraftServer?
        get() = _server

    override fun onEndTick(server: MinecraftServer?) {
        if(_server == null) {
            this._server = server
        }
    }

}