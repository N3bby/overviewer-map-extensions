package com.razacx.overviewer_map_extensions

import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents
import net.minecraft.server.MinecraftServer

object MinecraftServerProvider : ServerTickEvents.EndTick {

    private var _server: MinecraftServer? = null

    fun getServer(): MinecraftServer {
        return this._server!!
    }

    override fun onEndTick(server: MinecraftServer?) {
        if (server != null) {
            this._server = server
        }
    }

}
