import { Scene } from 'phaser';

import { Button } from '../../public/assets/class/button'

export class LevelSelector extends Scene
{
    private levelOne: Button;
    private levelTwo: Button;
    private levelThree: Button;
    private levelFour: Button;
    private levelFive: Button;

    constructor ()
    {
        super('LevelSelector');
    }

    create ()
    {
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'level_selector')

        this.levelOne = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) - 25, 'Level One', null, () => this.gotoLevelOne());
        this.levelTwo = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) + 25, 'Level Two', null, () => this.gotoLevelTwo());
        this.levelThree = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) + 75, 'Level Three', null, () => this.gotoLevelThree());
        this.levelFour = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) + 125, 'Level Four', null, () => this.gotoLevelFour());
        this.levelFive = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) + 175, 'Level Five', null, () => this.gotoLevelFive());
        this.add.existing(this.levelOne);
        this.add.existing(this.levelTwo);
        this.add.existing(this.levelThree);
        this.add.existing(this.levelFour);
        this.add.existing(this.levelFive);
        }

        gotoLevelOne() {
            this.scene.start('LevelOne')
          }
        gotoLevelTwo() {
          this.scene.start('LevelTwo')
        }
        gotoLevelThree() {
          this.scene.start('LevelThree')
        }
        gotoLevelFour() {
          this.scene.start('LevelFour')
        }
        gotoLevelFive() {
          this.scene.start('LevelFive')
        }
}
