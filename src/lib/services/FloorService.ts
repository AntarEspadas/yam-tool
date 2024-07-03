import type { Floor } from "$lib/types"
import { type MapDb, db } from "$lib/db/indext"
import { areaService, type AreaService } from "./AreaService"
import { polygonService, type PolygonService } from "./PolygonService"
import { Dexie } from "dexie"
export class FloorService {
  private static readonly KEY = "floors"

  constructor(
    private db: MapDb,
    private areaService: AreaService,
    private polygonService: PolygonService
  ) {}

  public addFloor(mapId: number) {
    return this.db.floors.add({
      mapId,
      grid: {
        visible: false,
        x: 50,
        y: 50,
        xOffset: 0,
        yOffset: 0,
      },
      name: "New Floor",
      sortOrder: 999,
    })
  }

  public getFloor(id: number) {
    return this.db.floors.where("id").equals(id).first()
  }

  public saveFloor(floor: Floor) {
    return this.db.floors.put(floor)
  }

  public getFloorsByMapId(mapId: number) {
    return this.db.floors.where("mapId").equals(mapId).sortBy("sortOrder")
  }

  public async deleteFloorById(floorId: number) {
    return this.db.transaction("rw", this.db.floors, this.db.areas, this.db.polygons, async () => {
      const [areas, polygons] = await Dexie.Promise.all([
        this.areaService.getAreasByFloor(floorId),
        this.polygonService.getPolygonsByFloor(floorId),
      ])
      return Dexie.Promise.all([
        this.db.areas.bulkDelete(areas.map((a) => a.id)),
        this.db.polygons.bulkDelete(polygons.map((p) => p.id)),
        this.db.floors.delete(floorId),
      ])
    })
  }
}

export const floorService = new FloorService(db, areaService, polygonService)
