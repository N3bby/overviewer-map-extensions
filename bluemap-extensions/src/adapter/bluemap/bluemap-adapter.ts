
class BluemapAdapter {

  private get bluemap(): any {
    return (window as any).bluemap;
  }

  isMapActive(key: string): boolean {
    return this.bluemap.mapsMap.get(key).isMap
  }

  setLightLevel(lightLevel: number) {
    this.bluemap.mapViewer.data.uniforms.sunlightStrength.value = lightLevel
  }

}

export const bluemap = new BluemapAdapter()
