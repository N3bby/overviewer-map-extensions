package com.razacx.overviewer_map_extensions.events;

import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.util.math.Vec3d

object OverviewerMapExtensionsEvents {

    val playerConnectedHandlers = mutableListOf<(ServerPlayerEntity) -> Unit>()
    val playerMovedHandlers = mutableListOf<(ServerPlayerEntity, Vec3d) -> Unit>()

    fun onPlayerConnected(handler: (ServerPlayerEntity) -> Unit) {
        playerConnectedHandlers.add(handler)
    }

    fun onPlayerMoved(handler: (ServerPlayerEntity, Vec3d) -> Unit) {
        playerMovedHandlers.add(handler)
    }

}
