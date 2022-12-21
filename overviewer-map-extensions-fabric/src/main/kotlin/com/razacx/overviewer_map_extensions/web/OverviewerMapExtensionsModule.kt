package com.razacx.overviewer_map_extensions.web

import com.razacx.overviewer_map_extensions.Events.players
import com.razacx.overviewer_map_extensions.Events.timeOfDay
import com.razacx.overviewer_map_extensions.ServerProvider.server
import io.ktor.serialization.kotlinx.*
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.reactivex.rxjava3.disposables.Disposable
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit

fun startWebServer() {
    embeddedServer(CIO, port = 8080, module = Application::overviewerMapExtensionsModule).start(wait = false)
}

fun Application.overviewerMapExtensionsModule() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json { encodeDefaults = true })
    }
    routing {
        webSocket("/ws") {
            println("Opened websocket session")
            val playerSubscription = doPlayerUpdates(100, TimeUnit.MILLISECONDS)
            val timeSubscription = doTimeUpdates()

            if(server != null) {
                // Initial time message
                sendSerializedSafe(TimeMessage(server!!.overworld.timeOfDay))
            }

            for (message in incoming) {
                // Keep web socket alive
            }

            println("Closed websocket session")
            playerSubscription.dispose()
            timeSubscription.dispose()
        }
    }
}

private fun WebSocketServerSession.doTimeUpdates(): Disposable {
    return timeOfDay.skip(1).subscribe { timeOfDay ->
        val timeMessage = TimeMessage(timeOfDay)
        println("Received tod from observable $timeOfDay")
        sendSerializedSafe(timeMessage)
    }
}

private fun WebSocketServerSession.doPlayerUpdates(interval: Long, unit: TimeUnit): Disposable {
    return players.throttleLast(interval, unit).subscribe {
        val playersMessage = PlayersMessage(it.map { player ->
            Player(
                player.uuidAsString,
                player.name.string,
                Position(player.pos.x, player.pos.y, player.pos.z),
                player.getWorld().registryKey.value.toString()
            )
        })
        sendSerializedSafe(playersMessage)
    }
}

private inline fun <reified T> WebSocketServerSession.sendSerializedSafe(data: T) {
    launch {
        try {
            sendSerialized(data)
        } catch (e: Exception) {
            println(e)
        }
    }
}
