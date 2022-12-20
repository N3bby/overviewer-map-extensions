package com.razacx.overviewer_map_extensions

import io.reactivex.rxjava3.core.Observable
import io.reactivex.rxjava3.subjects.BehaviorSubject
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents
import net.minecraft.server.MinecraftServer
import net.minecraft.server.network.ServerPlayerEntity
import kotlin.math.abs

private const val TICK_DELTA_TO_TRIGGER_TIME_EVENT = 5

object Events: ServerTickEvents.EndTick {

    private val _players = BehaviorSubject.create<List<ServerPlayerEntity>>()
    val players: Observable<List<ServerPlayerEntity>>
        get() = _players

    private var previousTime = 0L
    private val _time = BehaviorSubject.create<Long>()
    val time: Observable<Long>
        get() = _time

    override fun onEndTick(server: MinecraftServer?) {
        if(server != null) {
            _players.onNext(server.playerManager.playerList)

            val currentTime = server.overworld.timeOfDay
            if(abs(currentTime - previousTime) > TICK_DELTA_TO_TRIGGER_TIME_EVENT) {
                _time.onNext(currentTime)
                println("Time was updated!!")
            }
            previousTime = currentTime
        }
    }

}
