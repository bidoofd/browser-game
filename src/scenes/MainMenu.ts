import { Scene, GameObjects, Physics, Types, Tilemaps } from 'phaser';
//import Player from '../class/player.ts'

export class MainMenu extends Scene
{

    // Initialize variables
    background: GameObjects.Image;
    title: GameObjects.Text;

    private blocks: Physics.Arcade.StaticGroup
    private player: Physics.Arcade.Sprite
    private cursors: Types.Input.Keyboard.CursorKeys
    private level: Tilemaps.Tilemap
    private tileSet: Tilemaps.Tileset
    private coins: Tilemaps.Tile[]

    private startTile: Tilemaps.Tile[]
    private endTile: Tilemaps.Tile[]

    private totalCoins: integer
    private collectedCoins: integer

    private infoText;
    
    constructor ()
    {
        super('MainMenu');
    }

    preload() {

        this.totalCoins = 0
        this.collectedCoins = 0
        // Accepts cursor key input
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Loads all tiles
        this.load.image('tiles', 'assets/images/tiles.png');

        // Loads tile level data
        this.load.tilemapTiledJSON('levelone', 'assets/tilemapdata/level1.json');
    }

    create ()
    {
        // Create level tilemap and block tileset
        this.level = this.make.tilemap({ key: 'levelone', tileWidth: 16, tileHeight: 16})

        console.log("currentLayer", this.level.getLayer('Interactables'))
        
        this.tileSet = this.level.addTilesetImage('blockTiles', 'tiles')


        // Create and render layers
        this.level.createLayer('Background', this.tileSet, 0, 0)
        const blockTiles = this.level.createLayer('Blocks', this.tileSet)
        const objectTiles = this.level.createLayer('Interactables', this.tileSet)

        // Filter coin tiles
        this.coins = this.level.filterTiles(tile => tile.index === 19)
        this.totalCoins = this.coins.length
        console.log("coins", this.coins)
        console.log("totalcoins", this.totalCoins)

        this.startTile = this.level.filterTiles(tile => tile.index === 20)
        this.endTile = this.level.filterTiles(tile => tile.index === 21)

        console.log("startTile", this.startTile)
        console.log("endTile", this.endTile)

        
        // Creates a group of blocks for physics
        this.blocks = this.physics.add.staticGroup();

        // Adds the ground
        //this.blocks.create(800, 600, 'ground').setScale(10).refreshBody()

        // On click will place a "Block"
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const currentBlock = this.blocks.create(pointer.x, pointer.y, 'block') as Physics.Arcade.Sprite;
            currentBlock.setDisplaySize(16, 16)
            currentBlock.setSize(16, 16)
            currentBlock.setOrigin(0.8)
        }, this);

        // Adds player in physics
        this.player = this.physics.add.sprite(this.startTile[0].pixelX + 10, this.startTile[0].pixelY + 10, 'player')
        this.player.setMaxVelocity(800)
        this.player.setCollideWorldBounds(true)
        this.player.setDisplaySize(16, 16)

        // Adds physics collider between block types and the player
        blockTiles!.setCollisionByProperty({ collides: true})
        this.physics.add.collider(this.player, blockTiles!)
        this.physics.add.collider(this.player, this.blocks)
        this.physics.add.collider(this.player, objectTiles!)

        this.cursors.up.on('down', () => {
            if (this.player.body!.blocked.down)
            {
                this.player.setVelocityY(-200);
            }
        }, this);
        
        this.infoText = this.add.text(0, 0, 'Example')
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

        this.physics.world.overlapTiles(this.player, this.coins, this.hitPickup, null, this);

        if(this.collectedCoins === this.totalCoins && (this.physics.world.overlapTiles(this.player, this.endTile))) {
            this.scene.start('GameOver');
        }

        this.infoText.setText('Total Coins: ' + this.collectedCoins +  '/' + this.totalCoins.toString())
        
    }

    hitPickup (player, tile)
    {
        this.level.removeTile(tile, 7, false);
        this.collectedCoins = this.collectedCoins + 1;
        console.log("collectedCoins", this.collectedCoins)

        this.coins = this.level.filterTiles(tile => tile.index === 19);
    }
}
