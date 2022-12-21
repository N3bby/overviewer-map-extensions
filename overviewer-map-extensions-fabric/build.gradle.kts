import org.jetbrains.kotlin.kapt3.base.toJavacList

plugins {
    id("fabric-loom")
    kotlin("jvm").version(System.getProperty("kotlin_version"))
    kotlin("plugin.serialization") version "1.7.20"
    id("com.github.johnrengelman.shadow") version "7.1.2"
}
base { archivesName.set(project.extra["archives_base_name"] as String) }
version = project.extra["mod_version"] as String
group = project.extra["maven_group"] as String
val ktor_version = "2.2.1"
repositories {}
dependencies {
    minecraft("com.mojang", "minecraft", project.extra["minecraft_version"] as String)
    mappings("net.fabricmc", "yarn", project.extra["yarn_mappings"] as String, null, "v2")
    modImplementation("net.fabricmc", "fabric-loader", project.extra["loader_version"] as String)
    modImplementation("net.fabricmc.fabric-api", "fabric-api", project.extra["fabric_version"] as String)
    modImplementation(
        "net.fabricmc",
        "fabric-language-kotlin",
        project.extra["fabric_language_kotlin_version"] as String
    )

    shadow(implementation("io.ktor:ktor-server-core:$ktor_version")!!)
    shadow(implementation("io.ktor:ktor-server-netty:$ktor_version")!!)
    shadow(implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")!!)
    shadow(implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")!!)
    shadow(implementation("io.ktor:ktor-server-websockets:$ktor_version")!!)
    shadow(implementation("io.reactivex.rxjava3:rxkotlin:3.0.1")!!)
}
tasks {
    val javaVersion = JavaVersion.toVersion((project.extra["java_version"] as String).toInt())
    withType<JavaCompile> {
        options.encoding = "UTF-8"
        sourceCompatibility = javaVersion.toString()
        targetCompatibility = javaVersion.toString()
        options.release.set(javaVersion.toString().toInt())
    }
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> { kotlinOptions { jvmTarget = javaVersion.toString() } }
    jar { from("LICENSE") { rename { "${it}_${base.archivesName.get()}" } } }
    processResources {
        filesMatching("fabric.mod.json") {
            expand(
                mutableMapOf(
                    "version" to project.extra["mod_version"] as String,
                    "fabricloader" to project.extra["loader_version"] as String,
                    "fabric_api" to project.extra["fabric_version"] as String,
                    "fabric_language_kotlin" to project.extra["fabric_language_kotlin_version"] as String,
                    "minecraft" to project.extra["minecraft_version"] as String,
                    "java" to project.extra["java_version"] as String
                )
            )
        }
        filesMatching("*.mixins.json") { expand(mutableMapOf("java" to project.extra["java_version"] as String)) }
    }
    java {
        toolchain { languageVersion.set(JavaLanguageVersion.of(javaVersion.toString())) }
        sourceCompatibility = javaVersion
        targetCompatibility = javaVersion
        withSourcesJar()
    }

    shadowJar {
        archiveClassifier.set("shadow")
        configurations = listOf(project.configurations.shadow.get())
    }

    prepareRemapJar {
        dependsOn(shadowJar)
    }
    remapJar {
        inputFile.set(shadowJar.get().archiveFile.get())
    }
}
