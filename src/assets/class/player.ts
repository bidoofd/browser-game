// Modularise player somehow to be used?

import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
    }
}