package com.mod_author.mod_id

import net.fabricmc.api.ModInitializer

@Suppress("UNUSED")
object ModName : ModInitializer {
    private const val MOD_ID = "overviewer-map-extensions-fabric"
    override fun onInitialize() {
        println("$MOD_ID has been initialized.")
    }
}