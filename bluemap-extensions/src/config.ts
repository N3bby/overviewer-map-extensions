
export type Config = {
  websocketUrl: string
  maps?: {
    [key: string]: {
      blueMapKey: string
      simulateDayNightCycle?: boolean
    }
  }
}

export const config: Config = {
  websocketUrl: 'ws://localhost:8080/ws',
  maps: {
    'overworld': {
      blueMapKey: 'world',
      simulateDayNightCycle: true
    }
  }
}
