package by.n3b.bluemap_extensions.web

import by.n3b.bluemap_extensions.Events.players
import by.n3b.bluemap_extensions.Events.timeOfDay
import by.n3b.bluemap_extensions.ServerProvider
import io.ktor.serialization.kotlinx.*
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import io.ktor.server.plugins.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.reactivex.rxjava3.disposables.Disposable
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import java.util.concurrent.TimeUnit

private val LOGGER: Logger = LogManager.getLogger("BluemapExtensions")

fun startWebServer() {
    embeddedServer(CIO, port = 8080, module = Application::bluemapExtensionsModule).start(wait = false)
}

fun Application.bluemapExtensionsModule() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json { encodeDefaults = true })
    }
    routing {
        webSocket("/ws") {
            val clientIpAndPort = "${call.request.origin.remoteAddress}:${call.request.origin.remotePort}"
            LOGGER.info("Opened websocket session ($clientIpAndPort)")

            val server = ServerProvider.server
            val playerSubscription = doPlayerUpdates(100, TimeUnit.MILLISECONDS)
            val timeSubscription = doTimeUpdates()

            try {
                if (server != null) {
                    // Send initial time message
                    sendSerializedSafe(TimeMessage(server.overworld.timeOfDay))
                }

                for (frame in incoming) {
                    // Keep web socket alive
                }
            } catch (e: Exception) {
                LOGGER.error("An error occurred during websocket session ($clientIpAndPort)", e)
            } finally {
                LOGGER.info("Closed websocket session ($clientIpAndPort)")
                playerSubscription.dispose()
                timeSubscription.dispose()
            }
        }
    }
    LOGGER.info("Started websocket server")
}

private fun WebSocketServerSession.doTimeUpdates(): Disposable {
    return timeOfDay.skip(1).subscribe { timeOfDay ->
        val timeMessage = TimeMessage(timeOfDay)
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
                player.world.registryKey.value.toString()
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