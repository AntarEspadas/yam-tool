import type { MapDb } from "$lib/db/indext"
import type { Map } from "$lib/types"
import { db } from "$lib/db/indext"

export class MapService {
  constructor(private db: MapDb) {}

  public getMapById(mapId: number) {
    return this.db.maps.where("id").equals(mapId).first()
  }

  public addMap() {
    return this.db.maps.add({ name: "New Map", description: "" })
  }

  public saveMap(map: Map) {
    return this.db.maps.put(map)
  }

  public deleteMapById(mapId: number) {
    return this.db.maps.delete(mapId)
  }
}

export const mapService = new MapService(db)
