import { Scene } from 'phaser';

import { Button } from '../../public/assets/class/button'

export class MainMenu extends Scene
{
    private startButton: Button;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'logo')

        this.startButton = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) - 25, 'Start Game', null, () => this.gotoLevelSelector());
        this.add.existing(this.startButton);
        }

        gotoLevelSelector() {
            this.scene.start('LevelSelector')
          }
}
