import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Text{

    private graphics: Phaser.GameObjects.Graphics

    private updateStroke(x: number, y: number, width: number, height: number, strokeWidth: number, strokeColor: number) {
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff).fillRect(x, y, width, height);
        this.graphics.lineStyle(strokeWidth, strokeColor).strokeRect(x, y, width, height);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: Phaser.GameObjects.TextStyle | null, callback: () => void) {
        super(scene, x, y, text, style!);

        this.graphics = this.scene.add.graphics()
        this.updateStroke(x, y, this.width + 16, this.height + 16, 8, 0x000000);

        this.setFontFamily('Courier')
        this.setFontSize('16px')
        this.setPadding(8)
        this.setBackgroundColor("#ff9999")
        this.setFill("#000000")

        this.setInteractive({ useHandCursor: true })
          .on('pointerover', () => this.enterButtonHoverState() )
          .on('pointerout', () => this.enterButtonRestState() )
          .on('pointerdown', () => this.enterButtonActiveState() )
          .on('pointerup', () => {
            this.enterButtonHoverState();
            callback();
          });
        }
    enterButtonHoverState() {
        //dark
        this.setBackgroundColor("#ff6666")
        this.setFill("#f0f0f0")
        this.updateStroke(this.x, this.y, this.width, this.height, 12, 0x000000);
    }
    
    enterButtonRestState() {
        //light
        this.setBackgroundColor("#ff9999")
        this.setFill("#000000")
        this.updateStroke(this.x, this.y, this.width, this.height, 8, 0x000000);
    }
    
    enterButtonActiveState() {
        //darkest
        this.setBackgroundColor("#ff3333")
        this.setFill("#ffffff")
    }
}