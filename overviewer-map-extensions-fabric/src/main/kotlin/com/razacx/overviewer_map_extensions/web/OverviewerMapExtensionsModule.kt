package com.razacx.overviewer_map_extensions.web

import com.razacx.overviewer_map_extensions.Events.players
import com.razacx.overviewer_map_extensions.Events.timeOfDay
import io.ktor.serialization.kotlinx.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit

fun startWebServer() {
    embeddedServer(Netty, port = 8080) {
        install(WebSockets) {
            contentConverter = KotlinxWebsocketSerializationConverter(Json { encodeDefaults = true })
        }
        routing {
            webSocket("/ws") {
                println("Opened websocket session")
                val playerSubscription = players.throttleLast(100, TimeUnit.MILLISECONDS).subscribe {
                    val playersMessage = PlayersMessage(it.map { player ->
                        Player(
                            player.uuidAsString,
                            player.name.string,
                            Position(player.pos.x, player.pos.y, player.pos.z),
                            player.getWorld().registryKey.value.toString()
                        )
                    })
                    launch {
                        try {
                            sendSerialized(playersMessage)
                        } catch (e: Exception) {
                            println(e)
                        }
                    }
                }
                val timeSubscription = timeOfDay.subscribe { timeOfDay ->
                    val timeMessage = TimeMessage(timeOfDay)
                    launch {
                        try {
                            sendSerialized(timeMessage)
                        } catch (e: Exception) {
                            println(e)
                        }
                    }
                }

                for (message in incoming) {
                    // Keep web socket alive
                }

                println("Closed websocket session")
                playerSubscription.dispose()
                timeSubscription.dispose()
            }
        }
    }.start(wait = false)
}

