import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: integer, y: integer) {
        super(scene, x, y, 'player')
        //this.setCollideWorldBounds(true)
    }
}