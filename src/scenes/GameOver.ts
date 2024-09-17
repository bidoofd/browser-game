import { Scene } from 'phaser';
import { PageButton } from '../../public/assets/class/button';

export class GameOver extends Scene
{
    private mainMenuButton: PageButton

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'game_over')

        this.mainMenuButton= new PageButton(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) - 25, 'Main Menu', null, () => this.gotoMainMenu());
        this.add.existing(this.mainMenuButton);
    }

    gotoMainMenu() {
        this.scene.start('MainMenu')
    }
}

