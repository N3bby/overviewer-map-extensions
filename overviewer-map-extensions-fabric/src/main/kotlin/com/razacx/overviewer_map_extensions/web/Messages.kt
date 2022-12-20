package com.razacx.overviewer_map_extensions.web

import kotlinx.serialization.Serializable

@Serializable
data class PlayersMessage(val players: List<Player>, val type: String = "PLAYERS")

@Serializable
data class Player(val id: String, val name: String, val position: Position, val dimension: String)

@Serializable
data class Position(val x: Double, val y: Double, val z: Double)

@Serializable
data class TimeMessage(val timeOfDay: Long, val type: String = "TIME")