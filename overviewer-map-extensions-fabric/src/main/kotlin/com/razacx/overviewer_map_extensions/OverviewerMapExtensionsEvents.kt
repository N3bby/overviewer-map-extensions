package com.razacx.overviewer_map_extensions

import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.util.math.Vec3d

typealias PlayerMovedHandler = (player: ServerPlayerEntity, position: Vec3d) -> Unit

object OverviewerMapExtensionsEvents {

    val playerMovedHandlers = mutableListOf<PlayerMovedHandler>()

    fun onPlayerMoved(handler: PlayerMovedHandler) {
        playerMovedHandlers.add(handler)
    }

    fun playerMoved(player: ServerPlayerEntity, position: Vec3d) {
        playerMovedHandlers.forEach { it(player, position) }
    }

}
