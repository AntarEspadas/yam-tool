import { z } from "zod"

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
  first: z.boolean(),
  dragged: z.boolean().optional(),
})

export const PolygonSchema = z.object({
  id: z.string(),
  floorId: z.number(),
  points: z.array(PointSchema),
})

export const AreaSchema = z.object({
  id: z.string(),
  floorId: z.number(),
  identifier: z.string(),
  name: z.string(),
  description: z.string(),
})

export const GridSchema = z.object({
  x: z.number(),
  y: z.number(),
  xOffset: z.number(),
  yOffset: z.number(),
  visible: z.boolean(),
})

export const FloorSchema = z.object({
  id: z.number(),
  mapId: z.number(),
  image: z.string().optional(),
  grid: GridSchema,
  name: z.string(),
  sortOrder: z.number(),
})

export const MapSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
})

export const ImportedMapSchema = z.object({
  map: MapSchema,
  floors: z.array(FloorSchema),
  areas: z.array(AreaSchema),
  polygons: z.array(PolygonSchema),
})

export type Point = z.infer<typeof PointSchema>

export type Polygon = z.infer<typeof PolygonSchema>

export type Area = z.infer<typeof AreaSchema>

export type Grid = z.infer<typeof GridSchema>

export type Floor = z.infer<typeof FloorSchema>

export type Map = z.infer<typeof MapSchema>

export type ImportedMap = z.infer<typeof ImportedMapSchema>
