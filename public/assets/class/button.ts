import Phaser from 'phaser';

abstract class BaseButton extends Phaser.GameObjects.Text {
    protected graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: Phaser.GameObjects.TextStyle | null, 
                private defaultBackgroundColor: string, private hoverBackgroundColor: string, private activeBackgroundColor: string,
                private defaultTextColor: string, private hoverTextColor: string, private activeTextColor: string) {
        super(scene, x, y, text, style!);

        this.graphics = this.scene.add.graphics();
        this.updateStroke(x, y, this.width + 16, this.height + 16, 8, 0x000000);

        this.setFontFamily('Courier')
            .setFontSize('16px')
            .setPadding(8)
            .setBackgroundColor(this.defaultBackgroundColor)
            .setFill(this.defaultTextColor);

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                this.enterButtonHoverState();
                this.onClick();
            });
    }

    protected abstract onClick(): void;

    private updateStroke(x: number, y: number, width: number, height: number, strokeWidth: number, strokeColor: number) {
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff).fillRect(x, y, width, height);
        this.graphics.lineStyle(strokeWidth, strokeColor).strokeRect(x, y, width, height);
    }

    protected enterButtonHoverState() {
        this.setBackgroundColor(this.hoverBackgroundColor)
            .setFill(this.hoverTextColor);
        this.updateStroke(this.x, this.y, this.width, this.height, 12, 0x000000);
    }

    protected enterButtonRestState() {
        this.setBackgroundColor(this.defaultBackgroundColor)
            .setFill(this.defaultTextColor);
        this.updateStroke(this.x, this.y, this.width, this.height, 8, 0x000000);
    }

    protected enterButtonActiveState() {
        this.setBackgroundColor(this.activeBackgroundColor)
            .setFill(this.activeTextColor);
    }
}

export class PageButton extends BaseButton {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: Phaser.GameObjects.TextStyle | null, callback: () => void) {
        super(
            scene, x, y, text, style,
            "#ffc799", // defaultBackgroundColor
            "#ffac66", // hoverBackgroundColor
            "#ff9033", // activeBackgroundColor
            "#000000", // defaultTextColor
            "#f0f0f0", // hoverTextColor
            "#ffffff", // activeTextColor
        );

        this.onClick = callback;
    }

    protected onClick: () => void;
}

export class Button extends BaseButton {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: Phaser.GameObjects.TextStyle | null, callback: () => void) {
        super(
            scene, x, y, text, style,
            "#ff9999", // defaultBackgroundColor
            "#ff6666", // hoverBackgroundColor
            "#ff3333", // activeBackgroundColor
            "#000000", // defaultTextColor
            "#f0f0f0", // hoverTextColor
            "#ffffff", // activeTextColor
        );

        this.onClick = callback;
    }

    protected onClick: () => void;
}
