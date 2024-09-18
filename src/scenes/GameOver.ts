import { GameObjects, Scene } from 'phaser';
import { PageButton } from '../../public/assets/class/button';

export class GameOver extends Scene
{
    private mainMenuButton: PageButton
    private sceneData;

    private timerText: GameObjects.Text

    init(data) {
        this.sceneData = data
    }

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'game_over')

        this.timerText = this.add.text((this.game.canvas.width / 2) - 225, (this.game.canvas.height / 2) - 50, '', {fontSize: 25})
        this.timerText.setText(`Final Time Elapsed Time: ${this.sceneData.timerTime}`)

        this.mainMenuButton= new PageButton(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2), 'Main Menu', null, () => this.gotoMainMenu());
        this.add.existing(this.mainMenuButton);
    }

    gotoMainMenu() {
        this.scene.start('MainMenu')
    }
}

