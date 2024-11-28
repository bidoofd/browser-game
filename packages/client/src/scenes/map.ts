/* eslint-disable prettier/prettier */
/*import tilesetFloor from "url:@speedrun-browser-game/common/src/modules/map/TilesetFloor.png";
import tilesetInteriorFloor from "url:@speedrun-browser-game/common/src/modules/map/TilesetInteriorFloor.png";
import tilesetNature from "url:@speedrun-browser-game/common/src/modules/map/TilesetNature.png";
import mapJson from "@speedrun-browser-game/common/src/modules/map/map.json";*/

import level1Json from "@speedrun-browser-game/common/src/modules/map/level6.json";
import tiles from "url:@speedrun-browser-game/common/src/modules/map/tiles.png";

import Phaser from "phaser";

export const preloadMapAssets = (scene: Phaser.Scene): void => {

  scene.load.image("tiles", tiles)

  /*scene.load.image("floorTileset", tilesetFloor);
  scene.load.image("interiorFloorTileset", tilesetInteriorFloor);
  scene.load.image("natureTileset", tilesetNature);*/

  scene.load.tilemapTiledJSON("levelone", level1Json);
  //scene.load.tilemapTiledJSON("map", mapJson);
};

export const createMap = (scene: Phaser.Scene): void => {
  const levelone = scene.make.tilemap({ key: "levelone"});
  //const map = scene.make.tilemap({ key: "map" });

  const tileset = levelone.addTilesetImage("blockTiles", "tiles") as Phaser.Tilemaps.Tileset;
  /*const floorTileset = map.addTilesetImage("TilesetFloor", "floorTileset");
  const interiorFlorTileset = map.addTilesetImage(
    "TilesetInteriorFloor",
    "interiorFloorTileset"
  );
  map.createLayer("floor", [floorTileset, interiorFlorTileset], 0, 0);

  const natureTileset = map.addTilesetImage("TilesetNature", "natureTileset");*/

  const backgroundLayer = levelone.createLayer("Background", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
  const objectLayer = levelone.createLayer("Interactables", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
  const blockLayer = levelone.createLayer("Blocks", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;

  //const natureLayer = map.createLayer("nature", natureTileset, 0, 0);

  blockLayer.setCollisionByProperty({ collides: true});
  backgroundLayer.setCollisionByProperty({collides: false})
  //natureLayer.setCollisionByProperty({ collides: true });

  scene.matter.world.convertTilemapLayer(objectLayer);
  scene.matter.world.convertTilemapLayer(blockLayer);
  //scene.matter.world.convertTilemapLayer(backgroundLayer);
  //scene.matter.world.convertTilemapLayer(natureLayer);
};

export const findStartTile = (scene: Phaser.Scene) => {
  const level = scene.make.tilemap({key: "levelone"});
  const startTile = level.getLayer("Interactables")?.data
  .flatMap(tileRow => tileRow)  // Flatten the 2D array to 1D
  .find(startTile => startTile.index === 20);
  return startTile;
}

export const findEndTile = (scene: Phaser.Scene) => {
  const level = scene.make.tilemap({key: "levelone"});
  const endTile = level.getLayer("Interactables")?.data
  .flatMap(tileRow => tileRow)  // Flatten the 2D array to 1D
  .find(endTile => endTile.index === 21);
  return endTile;
}

export const createTileMap = (scene: Phaser.Scene) => {
  return scene.make.tilemap({key: "levelone"})
}
