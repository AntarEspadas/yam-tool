import type { MapDb } from "$lib/db/indext"
import {
  ImportedMapSchema,
  type Area,
  type Floor,
  type ImportedMap,
  type Map,
  type Polygon,
} from "$lib/types"
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

  public async getFloorsAreasAndPolygonsByMapId(
    mapId: number
  ): Promise<[Floor[], Area[], Polygon[]]> {
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
    return [floors, areas, polygons]
  }

  public deleteMapById(mapId: number) {
    return this.db.transaction(
      "rw",
      this.db.maps,
      this.db.floors,
      this.db.areas,
      this.db.polygons,
      async () => {
        const [floors, areas, polygons] = await this.getFloorsAreasAndPolygonsByMapId(mapId)
        return Dexie.Promise.all([
          this.db.maps.delete(mapId),
          this.db.floors.bulkDelete(floors.map((f) => f.id)),
          this.db.areas.bulkDelete(areas.map((a) => a.id)),
          this.db.polygons.bulkDelete(polygons.map((p) => p.id)),
        ])
      }
    )
  }

  public getMaps() {
    return this.db.maps.toArray()
  }

  public exportMap(mapId: number) {
    return this.db.transaction(
      "rw",
      this.db.maps,
      this.db.floors,
      this.db.areas,
      this.db.polygons,
      async () => {
        const map = await this.getMapById(mapId)
        const [floors, areas, polygons] = await this.getFloorsAreasAndPolygonsByMapId(mapId)
        return JSON.stringify({
          map,
          floors,
          areas,
          polygons,
        })
      }
    )
  }

  public async importMap(exportedMap: string) {
    let mapData: ImportedMap
    try {
      // Parse and validate imported json
      mapData = ImportedMapSchema.parse(JSON.parse(exportedMap))
    } catch (_e) {
      throw new Error("Invalid map format")
    }

    this.db.transaction(
      "rw",
      this.db.maps,
      this.db.floors,
      this.db.areas,
      this.db.polygons,
      async () => {
        // Remove old id so that new one is assigned
        mapData.map.id = undefined!
        const mapId = await this.db.maps.add(mapData.map)

        const oldFloorIds = []
        // Replace the old map id with the new one and remove all floor Ids so that new ones are assigned
        for (const floor of mapData.floors) {
          oldFloorIds.push(floor.id)
          floor.mapId = mapId
          floor.id = undefined!
        }
        const newFloorIds = await this.db.floors.bulkAdd(mapData.floors, { allKeys: true })

        // Create a map that relates each original floor id with the new one that was just assigned
        const floorIds = new Map<number, number>()
        for (let i = 0; i < oldFloorIds.length; i++) {
          floorIds.set(oldFloorIds[i], newFloorIds[i])
        }

        const areaIds = new Map<string, string>()

        // Replace old floor ids with new floor ids
        for (const area of mapData.areas) {
          area.floorId = floorIds.get(area.floorId)!
          const newId = crypto.randomUUID()
          areaIds.set(area.id, newId)
          area.id = newId
        }

        for (const polygon of mapData.polygons) {
          polygon.floorId = floorIds.get(polygon.floorId)!
          polygon.id = areaIds.get(polygon.id)!
        }

        await Dexie.Promise.all([
          this.db.areas.bulkAdd(mapData.areas),
          this.db.polygons.bulkAdd(mapData.polygons),
        ])
      }
    )
  }
}

const newMapDescription = `## Welcome to your new map

### Here's a few things you can do

- You can add floors to your map by clicking the \`+\` icon on the left sidebar
- You can edit your map's title, description and preview image by clicking the \`edit\` button below
- You can add styles like **bold** and *italic* to the description with [Markdown](https://www.markdownguide.org/basic-syntax/) syntax`

export const mapService = new MapService(db, floorService)
