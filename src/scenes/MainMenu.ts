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
        console.log("creating")
        this.socket = io('/', {
            withCredentials: true,
            extraHeaders: {
              "my-custom-header": "abcd"
            },
            transports: [
                'webpack'
            ]
        })
        this.socket.on('connection', () => {
            console.log("client console")
        })
        console.log('connected? ', this.socket.connected)
        console.log("after socket")
        /*this.socket.on("connect_error", (err) => {
            // the reason of the error, for example "xhr poll error"
            console.log('message', err.message);
          
            // some additional description, for example the status code of the initial HTTP response
            console.log('desc', err.description);
          
            // some additional context, for example the XMLHttpRequest object
            console.log('context', err.context);
          });*/
        this.add.image((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 100, 'logo')

        this.startButton = new Button(this, (this.game.canvas.width / 2) - 50, (this.game.canvas.height / 2) - 25, 'Start Game', null, () => this.gotoLevelSelector());
        this.add.existing(this.startButton);
        }

        gotoLevelSelector() {
            this.scene.start('LevelSelector')
          }
}
