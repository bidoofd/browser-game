import Phaser from "phaser";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";

import { randomInt } from "@speedrun-browser-game/common/src/utils/numbers";

import MonogramFontPNG from "url:../assets/fonts/monogram.png";
import MonogramFontXML from "url:../assets/fonts/monogram.xml";
import BadMofoFontPNG from "url:../assets/fonts/BadMofo.png";
import BadMofoXML from "url:../assets/fonts/BadMofo.xml";
import { getScreenCenter } from "../utils/text";
import { GameAssets, Scenes } from "../types";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: Scenes.LEVELSELECTOR,
};

export default class GameScene extends Phaser.Scene {
  nameInput?: InputText;

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.load.bitmapFont(GameAssets.TITLE, BadMofoFontPNG, BadMofoXML);
    this.load.bitmapFont(GameAssets.TEXT, MonogramFontPNG, MonogramFontXML);
  }

  public create({ playerName }: { playerName: string }): void {
    const name = playerName;
    const screenCenter = getScreenCenter(this);

    this.add
      .bitmapText(
        screenCenter.x,
        screenCenter.y - 200,
        GameAssets.TITLE,
        "LEVEL SELECTOR"
      )
      .setFontSize(128)
      .setOrigin(0.5)
      .setTintFill(0xe5a6ff);

    const leveloneButton = this.add
      .bitmapText(
        screenCenter.x,
        screenCenter.y - 100,
        GameAssets.TEXT,
        "LEVEL ONE"
      )
      .setOrigin(0.5)
      .setFontSize(48)
      .setTintFill(0x00000);

    leveloneButton.setInteractive({ useHandCursor: true });
    leveloneButton.on("pointerdown", () => {
      this.scene.start(Scenes.GAME, { playerName: name });
      this.scene.launch(Scenes.UI);
    });

    const startButton = this.add
      .bitmapText(screenCenter.x, screenCenter.y + 60, GameAssets.TEXT, "START")
      .setOrigin(0.5)
      .setFontSize(48)
      .setTintFill(0x00000);

    startButton.setInteractive({ useHandCursor: true });

    startButton.on("pointerdown", () => {
      this.scene.start(Scenes.GAME, { playerName: name });
      this.scene.launch(Scenes.UI);
    });
  }
}
