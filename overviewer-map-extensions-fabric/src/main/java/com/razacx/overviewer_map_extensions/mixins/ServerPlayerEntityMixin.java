package com.razacx.overviewer_map_extensions.mixins;

import com.mojang.authlib.GameProfile;
import com.razacx.overviewer_map_extensions.events.OverviewerMapExtensionsEvents;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityType;
import net.minecraft.network.encryption.PlayerPublicKey;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.util.math.Vec3d;
import net.minecraft.util.math.Vec3f;
import net.minecraft.world.World;
import org.jetbrains.annotations.Nullable;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(ServerPlayerEntity.class)
abstract class ServerPlayerEntityMixin extends ServerPlayerEntity {

    public ServerPlayerEntityMixin(MinecraftServer server, ServerWorld world, GameProfile profile, @Nullable PlayerPublicKey publicKey) {
        super(server, world, profile, publicKey);
    }

    @Inject(at = @At("HEAD"), method = "setPosition")
    public void setPosition(double x, double y, double z, CallbackInfo callbackInfo) {
        if(this instanceof ServerPlayerEntity) {
            OverviewerMapExtensionsEvents.INSTANCE.getPlayerMovedHandlers()
                    .forEach(handler -> handler.invoke(this, new Vec3d(x, y, z)));
        }
    }

}