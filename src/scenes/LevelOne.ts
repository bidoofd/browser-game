import { Scene, GameObjects, Physics, Types, Tilemaps } from 'phaser';
import { PageButton } from '../../public/assets/class/button';

export class LevelOne extends Scene
{
    // Initialize variables

    private blocks: Physics.Arcade.StaticGroup
    private player: Physics.Arcade.Sprite
    private cursors: Types.Input.Keyboard.CursorKeys

    private level: Tilemaps.Tilemap
    private tileSet: Tilemaps.Tileset
    private coins: Tilemaps.Tile[]
    private startTile: Tilemaps.Tile[]
    private endTile: Tilemaps.Tile[]
    private backgroundLayer: Tilemaps.TilemapLayer
    private blockLayer: Tilemaps.TilemapLayer
    private objectLayer: Tilemaps.TilemapLayer

    private totalCoins: integer
    private collectedCoins: integer

    // Text variables
    private infoText: GameObjects.Text

    // Button variables
    private backButton: PageButton

    // Resolution variables
    private screenWidth: number
    private screenHeight: number
    private levelWidth: number
    private levelHeight: number

    private blockPaletteMap: Tilemaps.Tilemap
    private blockPaletteTileSetImage: Tilemaps.Tileset
    private blockPaletteLayer: Tilemaps.TilemapLayer

    private marker: GameObjects.Graphics
    private selectedTile: Tilemaps.Tile
    
    constructor ()
    {
        super('LevelOne');
    }

    preload() {

        // Sets the screenheight and width variables
        this.screenHeight = this.sys.game.canvas.height
        this.screenWidth = this.sys.game.canvas.width

        // Set the coin variables
        this.totalCoins = 0
        this.collectedCoins = 0

        // Accepts cursor key input
        this.cursors = this.input.keyboard!.createCursorKeys()

        // Loads all tiles
        this.load.image('tiles', 'assets/images/tiles.png');

        // Loads tile level data
        this.load.tilemapTiledJSON('levelone', 'assets/tilemapdata/level1.json');
    }

    create ()
    {
        // Create level tilemap and block tileset
        this.level = this.make.tilemap({ key: 'levelone', tileWidth: 16, tileHeight: 16})
        this.levelWidth = this.level.widthInPixels
        this.levelHeight = this.level.heightInPixels

        const sceneCenterX = ((this.screenWidth - this.levelWidth) / 2)
        const sceneCenterY = ((this.screenHeight - this.levelHeight) / 2)

        console.log("sceneCenterX", sceneCenterX)
        console.log("sceneCenterY", sceneCenterY)

        this.blockPaletteMap = this.make.tilemap({key: 'blockpalette', tileHeight: 16, tileWidth: 16, height: 3, width: 9})

        this.blockPaletteTileSetImage = this.blockPaletteMap.addTilesetImage('Palette', 'tiles') as Phaser.Tilemaps.Tileset

        this.blockPaletteLayer = this.blockPaletteMap.createBlankLayer('Palette', this.blockPaletteTileSetImage) as Phaser.Tilemaps.TilemapLayer

        let blockTiles: number[][] = [];

        let value = 0;
        for (let row = 0; row < 3; row++) {
            blockTiles[row] = [];  // Initialize the row
            for (let col = 0; col < 9; col++) {
                blockTiles[row][col] = value;
                value++;  // Increment the value for the next tile
            }
        }

        // Set the tile data to the layer
        this.blockPaletteLayer.putTilesAt(blockTiles, 0, 0);
        console.log("width", ((this.screenWidth - this.levelWidth) / 2))
        console.log("height", ((this.screenHeight - this.levelHeight) / 2))
        this.blockPaletteLayer.setX(sceneCenterX)
        this.blockPaletteLayer.setY(sceneCenterY - 75)

        // Sets the level width and height based on the current level in pixels
        
        this.tileSet = this.level.addTilesetImage('blockTiles', 'tiles') as Tilemaps.Tileset

        // Create and render layers
        this.backgroundLayer = this.level.createLayer('Background', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2)) as Phaser.Tilemaps.TilemapLayer
        this.blockLayer = this.level.createLayer('Blocks', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2)) as Phaser.Tilemaps.TilemapLayer
        this.objectLayer = this.level.createLayer('Interactables', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2)) as Phaser.Tilemaps.TilemapLayer

        // Filter coin tiles
        this.coins = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 19) as Tilemaps.Tile[]
        this.totalCoins = this.coins.length

        // Filter start and end tiles (maybe have it as one tile?)
        this.startTile = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 20) as Tilemaps.Tile[]
        this.endTile = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 21) as Tilemaps.Tile[]
        
        // Creates a group of blocks for physics
        this.blocks = this.physics.add.staticGroup();

        // Convert the tilemaps into arrays
        const blockArray: Tilemaps.Tile[] = []
        this.blockLayer.forEachTile((tile: Tilemaps.Tile) => {
            blockArray.push(tile)
        });
        const backgroundArray: Tilemaps.Tile[] = []
        this.backgroundLayer.forEachTile((tile: Tilemaps.Tile) => {
            if(tile.index !== -1) {
                backgroundArray.push(tile)
            }
        });
        const interactableArray: Tilemaps.Tile[] = []
        this.objectLayer.forEachTile((tile: Tilemaps.Tile) => {
            if(tile.index !== -1) {
                interactableArray.push(tile)
            }
        });

        // Adds player in physics
        this.player = this.physics.add.sprite(this.level.tileToWorldX((this.startTile[0].x))! + 8, this.level.tileToWorldY(this.startTile[0].y)!, 'player')
        this.player.setVelocity(800)
        this.player.setCollideWorldBounds(true)
        this.player.setDisplaySize(16, 16)

        // Adds physics collider between block types and the player
        this.blockLayer.setCollisionByProperty({ collides: true})
        this.physics.add.collider(this.player, this.blockLayer)
        this.physics.add.collider(this.player, this.blocks)
        this.physics.add.collider(this.player, this.objectLayer)
        this.physics.add.collider(this.player, this.backgroundLayer)

        // Physics for when a person jumps
        this.cursors.up.on('down', () => {
            if (this.player.body!.blocked.down)
            {
                this.player.setVelocityY(-200);
            }
        }, this);

        // Block placement logic
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Block placement logic
            if(this.selectedTile) {
                if((pointer.x >= this.blockLayer.getBottomLeft().x && pointer.x <= this.blockLayer.getBottomRight().x) && (pointer.y <= this.blockLayer.getBottomLeft().y && pointer.y >= this.blockLayer.getTopLeft().y)) {
                    // Cases to remove types of tile
                    const blockTileToRemove = this.getTilePositionFromMap(pointer, this.level, this.blockLayer, blockArray) as Tilemaps.Tile
                    const backgroundTileToRemove = this.getTilePositionFromMap(pointer, this.level, this.backgroundLayer, backgroundArray) as Tilemaps.Tile
                    const objectTileToRemove = this.getTilePositionFromMap(pointer, this.level, this.objectLayer, interactableArray) as Tilemaps.Tile

                    console.log("block", blockTileToRemove)
                    console.log("bg", backgroundTileToRemove)
                    console.log("object", objectTileToRemove)

                    if((blockTileToRemove === undefined && objectTileToRemove === undefined) || (backgroundTileToRemove === undefined && objectTileToRemove === undefined)) {
                        console.log("clickling same thing twice")
                    }

                    // Removes blocks based on tile index and replaces with the selected block type. So far the max rows is 4, and columns is 8. Background tiles are on row 1
                    // Replacing normal blocks with normal blocks
                    else if(blockTileToRemove && ((backgroundTileToRemove.index === -1 && objectTileToRemove.index === -1) && (this.selectedTile.index > 8 && this.selectedTile.index < 18))) {
                        this.level.removeTile(blockTileToRemove, this.selectedTile.index + 1, false)
                        this.level.getTileAt(blockTileToRemove.x, blockTileToRemove.y, true, this.blockLayer)!.setCollision(true, true, true, true)
                    // Replacing interactables with normal blocks
                    } else if(objectTileToRemove && (this.selectedTile.index > 8 && this.selectedTile.index < 18)) {
                        this.level.removeTile(objectTileToRemove, this.selectedTile.index + 1, false)
                        const newBlockTile = this.level.getTileAt(blockTileToRemove.x, blockTileToRemove.y, true, this.objectLayer) as Phaser.Tilemaps.Tile
                        newBlockTile.setCollision(true, true, true, true)
                        this.level.putTileAt(newBlockTile, newBlockTile.x, newBlockTile.y, true, this.blockLayer)

                        // TODO: determine how to remove old block tile from object layer
                        // additionally need to remove the tile from the array
                        //console.log(interactableArray)
                    }
                    // Replacing background blocks with background blocks
                    else if(backgroundTileToRemove && ((blockTileToRemove.index === -1 && (objectTileToRemove === undefined || objectTileToRemove.index === -1)) && (this.selectedTile.index < 9))) {
                        this.level.removeTile(backgroundTileToRemove, this.selectedTile.index + 1, false)   
                    
                    // Replacing interactables with interactables
                    } else if(objectTileToRemove && ((blockTileToRemove.index === -1 && backgroundTileToRemove.index === -1)) && (this.selectedTile.index === 19)) {
                        this.level.removeTile(objectTileToRemove, this.selectedTile.index + 1, false)
                    
                    // Replacing blocks with interactables (blocked by replacing interactables with normal blocks?)
                    } else if(blockTileToRemove && (this.selectedTile.index === 19)) {
                        this.level.removeTile(blockTileToRemove, this.selectedTile.index + 1, false)
                        const newInteractableTile = this.level.getTileAt(objectTileToRemove.x, objectTileToRemove.y, true, this.blockLayer) as Phaser.Tilemaps.Tile
                        this.level.putTileAt(newInteractableTile, newInteractableTile.x, newInteractableTile.y, true, this.objectLayer)
                    }
                    // Everything else?
                    else {
                        this.level.removeTile(blockTileToRemove, this.selectedTile.index + 1, false)
                        this.level.getTileAt(blockTileToRemove.x, blockTileToRemove.y, true, this.blockLayer)!.setCollision(true, true, true, true)
                        if(this.selectedTile.index === 19) {
                            this.totalCoins = this.totalCoins + 1
                        }
                    }
                }
            }
        }, this);
        
        // Coin cointer text filler
        this.infoText = this.add.text(this.blockLayer.getTopLeft().x, this.blockLayer.getTopLeft().y - 15, '')

        // Back button to MainMenu
        this.backButton = new PageButton(this, this.blockLayer.getTopLeft().x - 75, this.blockLayer.getTopLeft().y + 5, 'Back', null, () => this.gotoMainMenu())
        this.add.existing(this.backButton)

        // Block outline hover
        this.marker = this.add.graphics()
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.strokeRect(0, 0, this.blockPaletteMap.tileWidth, this.blockPaletteMap.tileHeight);

    }

    update() {
        // Stops player from sliding right constantly. Not sure why this is
        this.player.setVelocityX(-10)

        // Left Press Down
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-160)
        }
        // Right Press Down
        else if(this.cursors.right.isDown) {
            this.player.setVelocityX(160)
        }

        // Coin collection
        this.physics.world.overlapTiles(this.player, this.coins, this.hitPickup.bind(this, (this.coins)), undefined, this);

        // When the player gets all coins and reaches the end tile
        if(this.collectedCoins === this.totalCoins && (this.physics.world.overlapTiles(this.player, this.endTile))) {
            this.scene.start('GameOver');
        }

        // Actually setting the coin text
        this.infoText.setText('Total Coins: ' + this.collectedCoins +  '/' + this.totalCoins.toString())
        
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2

        if((this.input.manager.activePointer.x >= this.blockPaletteLayer.getBottomLeft().x && this.input.manager.activePointer.x <= this.blockPaletteLayer.getBottomRight().x) && (this.input.manager.activePointer.y <= this.blockPaletteLayer.getBottomLeft().y && this.input.manager.activePointer.y >= this.blockPaletteLayer.getTopLeft().y)) {
            // Rounds down to nearest tile
            const pointerTileX = this.blockPaletteMap.worldToTileX(worldPoint.x) as number
            const pointerTileY = this.blockPaletteMap.worldToTileY(worldPoint.y) as number

            // Snap to tile coordinates, but in world space
            this.marker.x = this.blockPaletteMap.tileToWorldX(pointerTileX) as number
            this.marker.y = this.blockPaletteMap.tileToWorldY(pointerTileY) as number

            if (this.input.manager.activePointer.isDown)
            {
                this.selectedTile = this.blockPaletteMap.getTileAt(pointerTileX, pointerTileY) as Tilemaps.Tile;
            }
        }

        if((this.input.manager.activePointer.x >= this.blockLayer.getBottomLeft().x && this.input.manager.activePointer.x <= this.blockLayer.getBottomRight().x) && (this.input.manager.activePointer.y <= this.blockLayer.getBottomLeft().y && this.input.manager.activePointer.y >= this.blockLayer.getTopLeft().y)) {
            // Rounds down to nearest tile
            const pointerTileX = this.level.worldToTileX(worldPoint.x) as number
            const pointerTileY = this.level.worldToTileY(worldPoint.y) as number

            // Snap to tile coordinates, but in world space
            this.marker.x = this.level.tileToWorldX(pointerTileX) as number
            this.marker.y = this.level.tileToWorldY(pointerTileY) as number
        }
        if((this.input.manager.activePointer.x >= this.backgroundLayer.getBottomLeft().x && this.input.manager.activePointer.x <= this.backgroundLayer.getBottomRight().x) && (this.input.manager.activePointer.y <= this.backgroundLayer.getBottomLeft().y && this.input.manager.activePointer.y >= this.backgroundLayer.getTopLeft().y)) {
            // Rounds down to nearest tile
            const pointerTileX = this.level.worldToTileX(worldPoint.x) as number
            const pointerTileY = this.level.worldToTileY(worldPoint.y) as number

            // Snap to tile coordinates, but in world space
            this.marker.x = this.level.tileToWorldX(pointerTileX) as number
            this.marker.y = this.level.tileToWorldY(pointerTileY) as number
        }
        if((this.input.manager.activePointer.x >= this.objectLayer.getBottomLeft().x && this.input.manager.activePointer.x <= this.objectLayer.getBottomRight().x) && (this.input.manager.activePointer.y <= this.objectLayer.getBottomLeft().y && this.input.manager.activePointer.y >= this.objectLayer.getTopLeft().y)) {
            // Rounds down to nearest tile
            const pointerTileX = this.level.worldToTileX(worldPoint.x) as number
            const pointerTileY = this.level.worldToTileY(worldPoint.y) as number

            // Snap to tile coordinates, but in world space
            this.marker.x = this.level.tileToWorldX(pointerTileX) as number
            this.marker.y = this.level.tileToWorldY(pointerTileY) as number
        }
    }

    getTilePositionFromPlayer(player: Physics.Arcade.Sprite, tilemap: Tilemaps.Tilemap, layer: Tilemaps.TilemapLayer, coinTiles: Tilemaps.Tile[]) {
        // Convert player world position to tilemap coordinates
        const tileX = tilemap.worldToTileX(player.x) as number
        const tileY = tilemap.worldToTileY(player.y) as number
        
        // Gets the initial tile at the tilemap coordinates, then converts to center for accuracy
        const tile1 = layer.getTileAt(tileX, tileY, true)
        const tileCenterX = tile1.getCenterX()
        const tileCenterY = tile1.getCenterY()
        const tile = layer.getTileAt(tilemap.worldToTileX(tileCenterX)!, tilemap.worldToTileY(tileCenterY)!, true)
        
        // set tile index to find
        let tileIndex = 0

        for(const findTile of coinTiles) {
            if(findTile === tile) {
                tileIndex = findTile.index
            }
        }
        
        // If a tile exists, and the index of the current tile matches one found in the block array
        if (tile && (tile.index === tileIndex)) {
            // Convert tilemap coordinates back to world position
            const tileWorldX = tilemap.tileToWorldX(tile.x) as number
            const tileWorldY = tilemap.tileToWorldY(tile.y) as number
            
            return this.level.getTileAtWorldXY(tileWorldX, tileWorldY)
        } else {
            console.log('No tile at player position');
            return null;
        }
    }

    getTilePositionFromMap(pointer: Phaser.Input.Pointer, tilemap: Tilemaps.Tilemap, layer: Tilemaps.TilemapLayer, tiles: Tilemaps.Tile[]) {
        // Convert pointer world position to tilemap coordinates
        const tileX = tilemap.worldToTileX(pointer.x) as number
        const tileY = tilemap.worldToTileY(pointer.y) as number
        
        // Gets the initial tile at the tilemap coordinates, then converts to center for accuracy
        const tile1 = layer.getTileAt(tileX, tileY, true)
        const tileCenterX = tile1.getCenterX()
        const tileCenterY = tile1.getCenterY()
        const tile = layer.getTileAt(tilemap.worldToTileX(tileCenterX)!, tilemap.worldToTileY(tileCenterY)!, true)

        for(const findTile of tiles) {
            if(findTile === tile) {
                return findTile
            }
        }
    }

    hitPickup (coinTiles: Tilemaps.Tile[])
    {
        const coinTile = this.getTilePositionFromPlayer(this.player, this.level, this.objectLayer, coinTiles) as Tilemaps.Tile
        if(coinTile !== null) {
            this.level.removeTile(coinTile, 7, false);
            this.collectedCoins = this.collectedCoins + 1;

            this.coins = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 19) as Tilemaps.Tile[]
        }
    }

    gotoMainMenu() {
        this.scene.start('MainMenu')
    }
}
