package com.razacx.overviewer_map_extensions.web

import com.razacx.overviewer_map_extensions.MinecraftServerProvider
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.overviewerMapExtensionsModule() {
    install(ContentNegotiation) {
        json()
    }
    routing {
        get("/") {
            call.respond(MinecraftServerProvider.getServer().playerNames.toList())
        }
    }
}
