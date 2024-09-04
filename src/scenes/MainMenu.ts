import { Scene, GameObjects, Physics, Types } from 'phaser';
//import Player from '../class/player.ts'

export class MainMenu extends Scene
{

    // Initialize variables
    background: GameObjects.Image;
    title: GameObjects.Text;

    private blocks: Physics.Arcade.StaticGroup
    private player: Physics.Arcade.Sprite
    private cursors: Types.Input.Keyboard.CursorKeys
    
    constructor ()
    {
        super('MainMenu');
    }

    preload() {
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
        const levelOne = this.make.tilemap({ key: 'levelone', tileWidth: 16, tileHeight: 16})
        const blockTileset = levelOne.addTilesetImage('blockTiles', 'tiles')

        // Create and render layers
        levelOne.createLayer('Background', blockTileset!, 0, 0)
        const blockTiles = levelOne.createLayer('Blocks', blockTileset!)
        
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
        this.player = this.physics.add.sprite(400, 300, 'player')
        this.player.setMaxVelocity(800)
        this.player.setCollideWorldBounds(true)
        this.player.setDisplaySize(16, 16)

        // Adds physics collider between block types and the player
        blockTiles!.setCollisionByProperty({ collide: true})
        this.physics.add.collider(this.player, blockTiles!)
        this.physics.add.collider(this.player, this.blocks)

        this.cursors.up.on('down', () =>
            {
                if (this.player.body!.blocked.down)
                {
                    this.player.setVelocityY(-200);
                }
            }, this);

            

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
    }
}
