package com.mod_author.mod_id

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import net.fabricmc.api.ModInitializer
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents

object ModName : ModInitializer {

    private const val MOD_ID = "overviewer-map-extensions-fabric"
    val serverProvider = MinecraftServerProvider()

    override fun onInitialize() {
        ServerTickEvents.END_SERVER_TICK.register(serverProvider)

        embeddedServer(Netty, port = 8080) {
            install(ContentNegotiation) {
                json()
            }
            routing {
                get("/") {
                    call.respond(serverProvider.getServer().playerNames.toList())
                }
            }
        }.start(wait = false)
    }
}