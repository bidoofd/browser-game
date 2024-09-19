import Phaser from 'phaser';

function setupTilemapLayers(level: Phaser.Tilemaps.Tilemap, tileSetKey: string, sceneCenterX: number, sceneCenterY: number): { backgroundLayer: Phaser.Tilemaps.TilemapLayer, blockLayer: Phaser.Tilemaps.TilemapLayer, objectLayer: Phaser.Tilemaps.TilemapLayer } {
    const tileSet = level.addTilesetImage('blockTiles', tileSetKey) as Phaser.Tilemaps.Tileset;

    const backgroundLayer = level.createLayer('Background', tileSet, sceneCenterX, sceneCenterY) as Phaser.Tilemaps.TilemapLayer;
    const blockLayer = level.createLayer('Blocks', tileSet, sceneCenterX, sceneCenterY) as Phaser.Tilemaps.TilemapLayer;
    const objectLayer = level.createLayer('Interactables', tileSet, sceneCenterX, sceneCenterY) as Phaser.Tilemaps.TilemapLayer;

    return { backgroundLayer, blockLayer, objectLayer };
}

function filterTilesByIndex(level: Phaser.Tilemaps.Tilemap, index: number): Phaser.Tilemaps.Tile[] {
    return level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === index) as Phaser.Tilemaps.Tile[];
}

function createBlockPalette(scene: Phaser.Scene, key: string, tileWidth: number, tileHeight: number, paletteWidth: number, paletteHeight: number, positionX: number, positionY: number): { layer: Phaser.Tilemaps.TilemapLayer, blockPaletteMap: Phaser.Tilemaps.Tilemap } {
    const blockPaletteMap = scene.make.tilemap({ key, tileWidth, tileHeight, width: paletteWidth, height: paletteHeight });
    const blockPaletteTileSetImage = blockPaletteMap.addTilesetImage('Palette', 'tiles') as Phaser.Tilemaps.Tileset;
    const blockPaletteLayer = blockPaletteMap.createBlankLayer('Palette', blockPaletteTileSetImage) as Phaser.Tilemaps.TilemapLayer;

    const blockTiles: number[][] = [];
    let value = 0;
    
    for (let row = 0; row < paletteHeight; row++) {
        blockTiles[row] = [];
        for (let col = 0; col < paletteWidth; col++) {
            blockTiles[row][col] = value++;
        }
    }

    blockPaletteLayer.putTilesAt(blockTiles, 0, 0);
    blockPaletteLayer.setX(positionX);
    blockPaletteLayer.setY(positionY);

    return { layer: blockPaletteLayer, blockPaletteMap };
}

export { setupTilemapLayers, filterTilesByIndex, createBlockPalette }
