package com.razacx.overviewer_map_extensions.mixins;

import com.razacx.overviewer_map_extensions.events.OverviewerMapExtensionsEvents;
import net.minecraft.network.ClientConnection;
import net.minecraft.server.PlayerManager;
import net.minecraft.server.network.ServerPlayerEntity;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(PlayerManager.class)
public class PlayerManagerMixin {

    @Inject(at = @At("HEAD"), method = "onPlayerConnect")
    public void onPlayerConnect(ClientConnection connection, ServerPlayerEntity player, CallbackInfo callbackInfo) {
        OverviewerMapExtensionsEvents.INSTANCE.getPlayerConnectedHandlers()
                .forEach(listener -> listener.invoke(player));
    }

}
