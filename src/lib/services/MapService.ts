import type { MapDb } from "$lib/db/indext"
import type { Map } from "$lib/types"
import { db } from "$lib/db/indext"

export class MapService {
  constructor(private db: MapDb) {}

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
    return this.db.maps.delete(mapId)
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

export const mapService = new MapService(db)
