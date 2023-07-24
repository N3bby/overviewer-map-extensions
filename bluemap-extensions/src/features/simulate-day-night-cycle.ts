import { Config } from '../config';
import { minecraftServerAdapter } from '../adapter/minecraft-server/minecraft-server-adapter';
import { bluemap } from '../adapter/bluemap/bluemap-adapter';

export function simulateDayNightCycleFeature(config: Config) {

  const maps = getMapsToSimulateDayNightCycleOn(config)

  minecraftServerAdapter.init(config.websocketUrl)
  let lastServerTimeOfDay = 0;
  let lastServerTimeOfDayTimestamp = new Date();

  minecraftServerAdapter.time$.subscribe(({ timeOfDay }) => {
    lastServerTimeOfDay = timeOfDay
    lastServerTimeOfDayTimestamp = new Date()
    console.log(`Time has updated: ${timeOfDay}`)
  })

  const updateOverlays = () => {
    const timeOfDay = calculateTimeOfDay(lastServerTimeOfDay, lastServerTimeOfDayTimestamp);
    const lightLevel = 1 - getOpacityForTime(timeOfDay) // Was based on overlay transparency, but in bluemap it's actually a light level

    const shouldSimulateLight = maps.filter(map => bluemap.isMapActive(map)).length !== 0
    if (shouldSimulateLight) {
      bluemap.setLightLevel(lightLevel)
    } else {
      bluemap.setLightLevel(1)
    }

    requestAnimationFrame(updateOverlays)
  }
  updateOverlays()
}

function getMapsToSimulateDayNightCycleOn(config: Config): string[] {
  if (!config.maps) return [];
  return Object.keys(config.maps).filter(map => config.maps![map]?.simulateDayNightCycle)
}

function calculateTimeOfDay(lastServerTimeOfDay: number, lastServerTimeOfDayTimestamp: Date) {
  const MS_PER_TICK = 50;
  const TICKS_PER_DAY = 24_000;

  const msSinceLastServerUpdate = new Date().getTime() - lastServerTimeOfDayTimestamp.getTime();
  const ticksSinceLastServerUpdate = msSinceLastServerUpdate / MS_PER_TICK

  const timeOfDay = (lastServerTimeOfDay + ticksSinceLastServerUpdate) % TICKS_PER_DAY
  return timeOfDay;
}

function getOpacityForTime(timeOfDay: number): number {
  const DUSK_START = 12040
  const DUSK_END = 13670
  const DAWN_START = 22331
  const DAWN_END = 23961
  const NIGHT_OPACITY = 0.8;
  if (timeOfDay > DUSK_START && timeOfDay < DUSK_END) {
    // Dusk
    const t = (timeOfDay - DUSK_START) / (DUSK_END - DUSK_START);
    return easeInOut(t, 0, NIGHT_OPACITY)
  } else if (timeOfDay > DAWN_START && timeOfDay < DAWN_END) {
    // Dawn
    const t = (timeOfDay - DAWN_START) / (DAWN_END - DAWN_START);
    return easeInOut(t, NIGHT_OPACITY, 0)
  } else if (timeOfDay >= DUSK_END && timeOfDay <= DAWN_START) {
    // Night
    return NIGHT_OPACITY
  } else if (timeOfDay <= DUSK_START || timeOfDay >= DAWN_END) {
    // Day
    return 0
  } else {
    return 0
  }
}

function easeInOut(t: number, from: number, to: number) {
  const value = t * t * (3.0 - 2.0 * t);
  return from + (to - from) * value;
}
