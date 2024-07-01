import type { PageLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { floorService } from "$lib/services/FloorService"

export const load: PageLoad = async ({ params }) => {
  const floorId = Number(params.floor)
  if (isNaN(floorId)) error(400, "Invalid floor")

  const floor = await floorService.getFloor(floorId)

  if (floor === undefined) error(404, "Floor not found")

  return {
    floor,
  }
}
