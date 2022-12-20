package com.razacx.overviewer_map_extensions

import com.razacx.overviewer_map_extensions.web.startWebServer
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import net.fabricmc.api.ModInitializer
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents

object OverviewerMapExtensions : ModInitializer {

    override fun onInitialize() {
        ServerTickEvents.END_SERVER_TICK.register(MinecraftServerProvider)
        ServerTickEvents.END_SERVER_TICK.register(PlayerMovementTracker)

        startWebServer()
    }
}
