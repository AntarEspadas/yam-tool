import type { MapDb } from "$lib/db/indext"
import type { Map } from "$lib/types"
import { db } from "$lib/db/indext"
import Dexie from "dexie"
import { floorService, type FloorService } from "./FloorService"

export class MapService {
  constructor(
    private db: MapDb,
    private floorService: FloorService
  ) {}

  public getMapById(mapId: number) {
    return this.db.maps.where("id").equals(mapId).first()
  }

  public addMap() {
    return this.db.maps.add({
      name: "New Map",
      description: newMapDescription,
    })
  }

  public saveMap(map: Map) {
    return this.db.maps.put(map)
  }

  public deleteMapById(mapId: number) {
    return this.db.transaction(
      "rw",
      this.db.maps,
      this.db.floors,
      this.db.areas,
      this.db.polygons,
      async () => {
        const floors = await this.floorService.getFloorsByMapId(mapId)
        const floorIds = floors.map((f) => f.id)
        const [areas, polygons] = await Dexie.Promise.all([
          this.db.areas
            .where("floorId")
            .anyOf(...floorIds)
            .toArray(),
          this.db.polygons
            .where("floorId")
            .anyOf(...floorIds)
            .toArray(),
        ])
        return Dexie.Promise.all([
          this.db.maps.delete(mapId),
          this.db.floors.bulkDelete(floorIds),
          this.db.areas.bulkDelete(areas.map((a) => a.id)),
          this.db.polygons.bulkDelete(polygons.map((p) => p.id)),
        ])
      }
    )
  }

  public getMaps() {
    return this.db.maps.toArray()
  }
}

const newMapDescription = `## Welcome to your new map

### Here's a few things you can do

- You can add floors to your map by clicking the \`+\` icon on the left sidebar
- You can edit your map's title, description and preview image by clicking the \`edit\` button below
- You can add styles like **bold** and *italic* to the description with [Markdown](https://www.markdownguide.org/basic-syntax/) syntax`

export const mapService = new MapService(db, floorService)
