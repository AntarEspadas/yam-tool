import { type MapDb, db } from "$lib/db/indext"
import type { Area } from "$lib/types"

export class AreaService {
  constructor(private db: MapDb) {}

  public getAreasByFloor(floorId: number) {
    return this.db.areas.where("floorId").equals(floorId).sortBy("identifier")
  }

  public addArea(floorId: number) {
    const id = crypto.randomUUID()
    return this.db.areas.add({
      id,
      floorId,
      identifier: "",
      name: "",
      description: "",
    })
  }

  public deleteArea(areaId: string) {
    return this.db.areas.delete(areaId)
  }

  public getAreaById(areaId: string) {
    return this.db.areas.where("id").equals(areaId).first()
  }

  public saveArea(area: Area) {
    return this.db.areas.put(area)
  }
}

export const areaService = new AreaService(db)
