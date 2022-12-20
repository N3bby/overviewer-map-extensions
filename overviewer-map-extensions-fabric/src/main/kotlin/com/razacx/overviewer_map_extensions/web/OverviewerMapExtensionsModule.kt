package com.razacx.overviewer_map_extensions.web

import com.razacx.overviewer_map_extensions.Events.players
import com.razacx.overviewer_map_extensions.Events.time
import com.razacx.overviewer_map_extensions.ServerProvider
import io.ktor.serialization.kotlinx.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.reactivex.rxjava3.disposables.Disposable
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit

fun startWebServer() {
    embeddedServer(Netty, port = 8080, module = Application::overviewerMapExtensionsModule).start(wait = false)
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
    return time.subscribe { time ->
        val timeMessage = TimeMessage(time)
        sendSerializedSafe(timeMessage)
    }
}

private fun WebSocketServerSession.doPlayerUpdates(interval: Long, unit: TimeUnit): Disposable {
    return players.throttleLast(interval, unit).subscribe {
        val playersMessage = PlayersMessage(it.map { player ->
            Player(
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
