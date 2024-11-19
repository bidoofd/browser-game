import { resolution } from "../../resolution";
import { GameAssets } from "../../types";

export class TimerUI {
  scene: Phaser.Scene;
  timerText: Phaser.GameObjects.Text;
  timer: Phaser.Time.TimerEvent;
  timerSecondCount = 0;

  constructor({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;

    this.timerText = this.scene.add.text(
      resolution.width / resolution.zoom + 1000,
      resolution.height / resolution.zoom + 650,
      "",
      {
        fontSize: "48px",
      }
    );

    this.timer = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timerSecondCount++;
      },
      callbackScope: this,
      loop: true,
    });
  }

  public updateTimer(): void {
    this.timerText.setText(
      `Timer: ${this.timerSecondCount}.${this.timer
        .getElapsedSeconds()
        .toString()
        .substring(2, 6)}`
    );
  }

  public getTimer(): string {
    return this.timerText.toString()
  }
}
