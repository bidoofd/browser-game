import { Scene, GameObjects, Physics, Types } from 'phaser';
//import Player from '../class/player.ts'

export class MainMenu extends Scene
{

    // Initialize variables
    background: GameObjects.Image;
    title: GameObjects.Text;

    private blocks: Physics.Arcade.StaticGroup
    private player: Physics.Arcade.Image
    private cursors: Types.Input.Keyboard.CursorKeys
    
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Creates a group of blocks for physics
        this.blocks = this.physics.add.staticGroup();

        // Adds the ground
        this.blocks.create(800, 600, 'ground').setScale(10).refreshBody()

        // On click will place a "Block"
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.blocks.create(pointer.x, pointer.y, 'block') as Physics.Arcade.Sprite;
        }, this);

        // Adds player in physics
        this.player = this.physics.add.sprite(400, 300, 'player')
        this.player.setCollideWorldBounds(true)

        // Accepts cursor key input
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Adds physics collider between block types and the player
        this.physics.add.collider(this.player, this.blocks)
    }

    update() {
        // No cursor exists
        if(!this.cursors) {
            return
        }
        // Left Press Down
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-160)
        }
        // Right Press Down
        else if(this.cursors.right.isDown) {
            this.player.setVelocityX(160)
        }
        else {
        // Not Pressing Down
            this.player.setVelocityX(-10)
        }
        // Pressing Up, AND player is touching ground
        if(this.cursors.up.isDown && this.player.body!.touching.down) {
            this.player.setVelocityY(-330)
        }
    }
}
