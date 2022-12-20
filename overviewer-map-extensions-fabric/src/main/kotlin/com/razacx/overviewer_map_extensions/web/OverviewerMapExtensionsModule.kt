package com.razacx.overviewer_map_extensions.web

import com.razacx.overviewer_map_extensions.OverviewerMapExtensionsEvents.onPlayerMoved
import io.ktor.serialization.kotlinx.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

fun startWebServer() {
    embeddedServer(Netty, port = 8080, module = Application::overviewerMapExtensionsModule).start(wait = false)
}

fun Application.overviewerMapExtensionsModule() {
    install(ContentNegotiation) {
        json()
    }
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
    }
    routing {
        webSocket("/ws") {
            // TODO Unsubscribe when websocket closes or the entire thing crashes...
            onPlayerMoved { player, position ->
                runBlocking {
                    sendSerialized(PlayerMovementFrame(
                        player.name.string,
                        Position(position.x, position.y, position.z)
                    ))
                }
            }
            for (message in incoming) {
                println(message)
            }
        }
    }
}

@Serializable
data class PlayerMovementFrame(val player: String, val position: Position)
@Serializable
data class Position(val x: Double, val y: Double, val z: Double)
