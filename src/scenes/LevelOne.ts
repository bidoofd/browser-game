import { Scene, GameObjects, Physics, Types, Tilemaps } from 'phaser';
import { Button, PageButton } from '../../public/assets/class/button';

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

        // Sets the level width and height based on the current level in pixels
        this.levelWidth = this.level.widthInPixels
        this.levelHeight = this.level.heightInPixels
        
        this.tileSet = this.level.addTilesetImage('blockTiles', 'tiles') as Tilemaps.Tileset

        // Create and render layers
        this.backgroundLayer = this.level.createLayer('Background', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2))!
        this.blockLayer = this.level.createLayer('Blocks', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2))!
        this.objectLayer = this.level.createLayer('Interactables', this.tileSet, ((this.screenWidth - this.levelWidth) / 2), ((this.screenHeight - this.levelHeight) / 2))!

        console.log("blockLayer", this.blockLayer)

        // Filter coin tiles
        this.coins = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 19) as Tilemaps.Tile[]
        this.totalCoins = this.coins.length

        // Filter start and end tiles (maybe have it as one tile?)
        this.startTile = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 20) as Tilemaps.Tile[]
        this.endTile = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 21) as Tilemaps.Tile[]
        
        // Creates a group of blocks for physics
        this.blocks = this.physics.add.staticGroup();

        // On click will place a "Block" (TODO: can only place block within map)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const blockArray: Tilemaps.Tile[] = []
            blockArray.forEach((tile: Tilemaps.Tile) => {
                blockArray.push(tile)
            });
            if((pointer.x >= 0 && pointer.x <= this.levelWidth) && (pointer.y >= 0 && pointer.y <= this.levelHeight)) {
                const currentBlock = this.blocks.create(pointer.x, pointer.y, 'block') as Physics.Arcade.Sprite;
                currentBlock.setDisplaySize(16, 16)
                currentBlock.setSize(16, 16)
                currentBlock.setOrigin(0.8)
            }
        }, this);

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

        this.cursors.up.on('down', () => {
            if (this.player.body!.blocked.down)
            {
                this.player.setVelocityY(-200);
            }
        }, this);
        
        // Coin cointer text filler
        this.infoText = this.add.text(560, 300, '')

        // Back button to MainMenu
        this.backButton = new PageButton(this, 400, 500, 'Back', null, () => this.gotoMainMenu())
        this.add.existing(this.backButton)
    }

    update() {
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
        
    }

    getTilePositionFromPlayer(player: Physics.Arcade.Sprite, tilemap: Tilemaps.Tilemap, layer: Tilemaps.TilemapLayer, coinTiles: Tilemaps.Tile[]) {
        // Convert player world position to tilemap coordinates
        const tileX = tilemap.worldToTileX(player.x)!
        const tileY = tilemap.worldToTileY(player.y)!
        
        // Get the tile at the tilemap coordinates
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
        
        // If a tile exists, and the index of the current tile matches one found in the coin array
        if (tile && (tile.index === tileIndex)) {
            // Convert tilemap coordinates back to world position
            const tileWorldX = tilemap.tileToWorldX(tile.x)!
            const tileWorldY = tilemap.tileToWorldY(tile.y)!
            
            return this.level.getTileAtWorldXY(tileWorldX, tileWorldY)
        } else {
            console.log('No tile at player position');
            return null;
        }
    }

    hitPickup (coinTiles: Tilemaps.Tile[])
    {
        const coinTile = this.getTilePositionFromPlayer(this.player, this.level, this.objectLayer, coinTiles)!
        if(coinTile !== null) {
            this.level.removeTile(coinTile, 7, false);
            this.collectedCoins = this.collectedCoins + 1;
            console.log("collectedCoins", this.collectedCoins)

            this.coins = this.level.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === 19) as Tilemaps.Tile[]
        }
    }

    gotoMainMenu() {
        this.scene.start('MainMenu')
    }
}
