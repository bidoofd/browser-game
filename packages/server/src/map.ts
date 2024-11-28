import matter from "matter-js";
import mapJson from "@speedrun-browser-game/common/src/modules/map/level6.json";
import { MAP_SIZE } from "@speedrun-browser-game/common/build/modules/map";

import { randomInt } from "@speedrun-browser-game/common/build/utils/numbers";
import { TVector2 } from "@speedrun-browser-game/common/build/modules/math";

const addWorldBounds = (world: Matter.World) => {
  matter.Composite.add(world, [
    // Horizontal bounds (left and right)

    // Left
    matter.Bodies.rectangle(-5, MAP_SIZE.height / 2, 10, MAP_SIZE.height, {
      isStatic: true,
      slop: 0.0001,
      inertia: Infinity,
    }),

    // Right
    matter.Bodies.rectangle(
      MAP_SIZE.width + 5,
      MAP_SIZE.height / 2,
      10,
      MAP_SIZE.height,
      {
        isStatic: true,
        slop: 0.0001,
        inertia: Infinity,
      }
    ),

    // Vertical bounds (top and bottom)

    // Top
    matter.Bodies.rectangle(MAP_SIZE.width / 2, -5, MAP_SIZE.width, 10, {
      isStatic: true,
      slop: 0.0001,
      inertia: Infinity,
    }),

    // Bottom
    matter.Bodies.rectangle(
      MAP_SIZE.width / 2,
      MAP_SIZE.height + 5,
      MAP_SIZE.width,
      10,
      { isStatic: true, slop: 0.0001, inertia: Infinity }
    ),
  ]);
};

const layerToTileset = (
  layerName: string,
  tilesetName: string,
  world: Matter.World
) => {
  const mapLayer = mapJson.layers.find((l) => l.name === layerName);

  if (!mapLayer) {
    throw Error(`Map layer with name ${layerName} not found`);
  }

  // Tiled editor assigns a global ID to each tile in the tileset
  // We need to get the first GID to calculate the tile index
  // More information: https://doc.mapeditor.org/en/stable/reference/global-tile-ids/#mapping-a-gid-to-a-local-tile-id

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tileset = mapJson.tilesets.find((t) => t.name === tilesetName)!;
  const tilesetFirstGID = tileset.firstgid;

  mapLayer.data.forEach((tileNumber, i) => {
    if (tileNumber === 0) return;

    const tileX = i % mapLayer.width;
    const tileY = Math.floor(i / mapLayer.width);

    const localTilesetTileId = tileNumber - tilesetFirstGID;

    const customCollisionObjects =
      tileset.tiles?.[localTilesetTileId].objectgroup?.objects;

    if (customCollisionObjects) {
      customCollisionObjects.forEach((collisionObject) => {
        const body = matter.Bodies.rectangle(
          tileX * mapJson.tilewidth +
            collisionObject.x +
            collisionObject.width / 4,
          tileY * mapJson.tileheight +
            collisionObject.y +
            collisionObject.height / 4,
          collisionObject.width,
          collisionObject.height,
          { isStatic: true, restitution: 0, slop: 0.0001, inertia: Infinity }
        );
        matter.Composite.add(world, body);
      });
    } else {
      // Ony enable rectangle custom collision objects for now
      const body = matter.Bodies.rectangle(
        tileX * mapJson.tilewidth + mapJson.tilewidth / 4,
        tileY * mapJson.tileheight + mapJson.tileheight / 4,
        mapJson.tilewidth,
        mapJson.tileheight,
        { isStatic: true, restitution: 0, slop: 0.0001, inertia: Infinity }
      );
      matter.Composite.add(world, body);
    }
  });
};

export class Map {
  constructor(world: matter.World) {
    addWorldBounds(world);
    layerToTileset("Interactables", "blockTiles", world);
    layerToTileset("Blocks", "blockTiles", world);
    //layerToTileset("Background", "blockTiles", world);
    //layerToTileset("nature", "TilesetNature", world);
  }
}

/** Get random map position that doesn't collide with other bodies **/
export function getValidBodyPosition(
  world: matter.World,
  bodySize: number
): TVector2 {
  const tilesets = mapJson.layers.find((t) => t.name === "Interactables")!;
  const levelarray = tilesets.data;
  const numColumns = tilesets.width; // Number of elements per row
  const numRows = tilesets.height; // Calculate the number of rows

  let newPosition: TVector2 = { x: 0, y: 0 };

  // Loop through the 2D "array"
  for (let row = 0; row < numRows; row++) {
    // Create a sub-array for the current row
    const rowStart = row * numColumns;
    const rowEnd = Math.min((row + 1) * numColumns, levelarray.length);
    const rowArray = levelarray.slice(rowStart, rowEnd);

    // Process each row

    // If you want to stop on encountering a number 20, add a break condition
    if (rowArray.includes(20)) {
      newPosition.y = row;
      newPosition.x = rowArray.indexOf(20);
      break; // Exit the loop when 20 is found
    }
  }

  const pos = {
    x: newPosition.x * 16,
    y: newPosition.y * 16,
  };
  return pos;
}
