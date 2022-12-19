package com.razacx.overviewer_map_extensions

import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents
import net.minecraft.server.MinecraftServer
import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.util.math.Vec3d

object PlayerMovementTracker : ServerTickEvents.EndTick {

    private val playerPositions = mutableMapOf<ServerPlayerEntity, Vec3d>()

    override fun onEndTick(server: MinecraftServer) {
        server.playerManager.playerList.forEach { player ->
            if (player in playerPositions) {
                if (player.pos != playerPositions[player]) {
                    playerPositions[player] = player.pos
                    OverviewerMapExtensionsEvents.playerMoved(player, player.pos)
                }
            } else {
                playerPositions[player] = player.pos
                OverviewerMapExtensionsEvents.playerMoved(player, player.pos)
            }
        }
    }

}
