package com.razacx.overviewer_map_extensions

import com.razacx.overviewer_map_extensions.events.OverviewerMapExtensionsEvents
import com.razacx.overviewer_map_extensions.web.overviewerMapExtensionsModule
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import net.fabricmc.api.ModInitializer
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents

object OverviewerMapExtensions : ModInitializer {
    override fun onInitialize() {
        ServerTickEvents.END_SERVER_TICK.register(MinecraftServerProvider)
        embeddedServer(Netty, port = 8080, module = Application::overviewerMapExtensionsModule).start(wait = false)

        OverviewerMapExtensionsEvents.onPlayerConnected { println("(ext) Player connected ${it.name.content}") }
        OverviewerMapExtensionsEvents.onPlayerMoved { player, position -> println("(ext) Player ${player.name.content} moved to $position") }
    }
}