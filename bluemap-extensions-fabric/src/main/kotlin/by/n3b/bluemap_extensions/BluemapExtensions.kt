package by.n3b.bluemap_extensions

import by.n3b.bluemap_extensions.web.startWebServer
import net.fabricmc.api.ModInitializer
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents

object BluemapExtensions : ModInitializer {

    override fun onInitialize() {
        ServerTickEvents.END_SERVER_TICK.register(Events)
        ServerTickEvents.END_SERVER_TICK.register(ServerProvider)

        startWebServer()
    }

}