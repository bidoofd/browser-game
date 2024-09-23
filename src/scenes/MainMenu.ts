import { Scene } from 'phaser';

import { Button } from '../../public/assets/class/button'

import io from 'socket.io-client'

export class MainMenu extends Scene
{
    private startButton: Button;
    private socket: any;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.socket = io('http://localhost:27568/', {
            withCredentials: true,
            extraHeaders: {
              "my-custom-header": "abcd"
            }})
        this.socket.on('connection', (socket) => {
            console.log("client console")
            socket.emit("console");
        })
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'logo')

        this.startButton = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) - 25, 'Start Game', null, () => this.gotoLevelSelector());
        this.add.existing(this.startButton);
        }

        gotoLevelSelector() {
            this.scene.start('LevelSelector')
          }
}
