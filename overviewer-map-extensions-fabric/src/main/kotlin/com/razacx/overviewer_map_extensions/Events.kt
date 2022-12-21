package com.razacx.overviewer_map_extensions

import io.reactivex.rxjava3.core.Observable
import io.reactivex.rxjava3.subjects.BehaviorSubject
import io.reactivex.rxjava3.subjects.Subject
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents
import net.minecraft.server.MinecraftServer
import net.minecraft.server.network.ServerPlayerEntity
import kotlin.math.abs

private const val TICK_DELTA_TO_TRIGGER_TIME_EVENT = 5

object Events: ServerTickEvents.EndTick {

    private val _players = BehaviorSubject.create<List<ServerPlayerEntity>>()
    val players: Observable<List<ServerPlayerEntity>>
        get() = _players

    private var previousTimeOfDay = 0L
    private val _timeOfDay = BehaviorSubject.create<Long>()
    val timeOfDay: Observable<Long>
        get() = _timeOfDay

    override fun onEndTick(server: MinecraftServer?) {
        if(server != null) {
            _players.onNext(server.playerManager.playerList)

            val currentTimeOfDay = server.overworld.timeOfDay
            if(abs(currentTimeOfDay - previousTimeOfDay) > TICK_DELTA_TO_TRIGGER_TIME_EVENT) {
                _timeOfDay.onNext(currentTimeOfDay)
            }
            previousTimeOfDay = currentTimeOfDay
        }
    }

}
