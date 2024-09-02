// Unused right now. Going to be used as a level

import { GameObjects, Scene } from 'phaser';

export class level1 extends Scene {
    private player!: GameObjects.Sprite;

    constructor() {
        super('level1-scene')
    }

    create(): void {
        this.player = this.add.sprite(16, 16, 'player')
    }
}