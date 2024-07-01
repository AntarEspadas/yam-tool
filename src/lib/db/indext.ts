import Dexie, { type EntityTable } from "dexie"
import type { Map, Floor, Polygon, Area } from "$lib/types"

export const db = new Dexie("mapDb") as MapDb

db.version(1).stores({
  maps: "++id",
  floors: "++id, mapId, sortOrder",
  polygons: "id, floorId",
  areas: "id, floorId, identifier, name",
})

export interface MapDb extends Dexie {
  maps: EntityTable<Map, "id">
  floors: EntityTable<Floor, "id">
  polygons: EntityTable<Polygon, "id">
  areas: EntityTable<Area, "id">
}
