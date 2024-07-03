import { error } from "@sveltejs/kit"
import { mapService } from "$lib/services/MapService"

export const ssr = false
export const prerender = false

export const load = async ({ params }) => {
  const mapId = Number(params.map)

  if (isNaN(mapId)) error(400, "Invalid map")

  const map = await mapService.getMapById(mapId)

  if (map === undefined) error(404, "Map not found")

  return {
    map,
  }
}
