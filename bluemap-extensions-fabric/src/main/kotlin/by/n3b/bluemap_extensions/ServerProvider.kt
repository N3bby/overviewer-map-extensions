package by.n3b.bluemap_extensions

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