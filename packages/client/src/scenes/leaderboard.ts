import Phaser from "phaser";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";

import { randomInt } from "@speedrun-browser-game/common/src/utils/numbers";

import MonogramFontPNG from "url:../assets/fonts/monogram.png";
import MonogramFontXML from "url:../assets/fonts/monogram.xml";
import BadMofoFontPNG from "url:../assets/fonts/BadMofo.png";
import BadMofoXML from "url:../assets/fonts/BadMofo.xml";
import { getScreenCenter } from "../utils/text";
import { GameAssets, Scenes } from "../types";
import { Socket } from "socket.io-client";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: Scenes.LEADERBOARD,
};

export default class GameScene extends Phaser.Scene {
  nameInput?: InputText;
  rankData = [
    { rank: 1, name: "Alice", score: 95 },
    { rank: 2, name: "Bob", score: 85 },
    { rank: 3, name: "Charlie", score: 75 },
    { rank: 4, name: "Diana", score: 65 },
    { rank: 5, name: "Eve", score: 55 },
  ];
  rankCount = -250;

  //fs.writeFileSync(filePath, jsonData, 'utf-8');

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.load.bitmapFont(GameAssets.TITLE, BadMofoFontPNG, BadMofoXML);
    this.load.bitmapFont(GameAssets.TEXT, MonogramFontPNG, MonogramFontXML);
  }

  public create(socket: Socket): void {
    const iosocket = socket
    const screenCenter = getScreenCenter(this);

    if(iosocket.connected === true) {
      console.log("true");
    }

    this.add
      .bitmapText(
        screenCenter.x,
        screenCenter.y - 400,
        GameAssets.TITLE,
        "LEADERBOARD"
      )
      .setFontSize(128)
      .setOrigin(0.5)
      .setTintFill(0xe5a6ff);

    this.add
      .bitmapText(
        screenCenter.x,
        screenCenter.y - 300,
        GameAssets.TEXT,
        `RANK     NAME     SCORE`
      )
      .setFontSize(72)
      .setOrigin(0.5)
      .setTintFill(0x000000);
    this.rankData.forEach((scoreline) => {
      this.add
        .bitmapText(
          screenCenter.x,
          screenCenter.y + this.rankCount,
          GameAssets.TEXT,
          `${scoreline.rank}      ${scoreline.name}      ${scoreline.score}`
        )
        .setFontSize(72)
        .setOrigin(0.5)
        .setTintFill(0x000000);
      this.rankCount += 50;
    });

    const levelSelectorButton = this.add
      .bitmapText(screenCenter.x, screenCenter.y + 300, GameAssets.TEXT, "BACK")
      .setOrigin(0.5)
      .setFontSize(48)
      .setTintFill(0x00000);

    levelSelectorButton.setInteractive({ useHandCursor: true });

    levelSelectorButton.on("pointerdown", () => {
      //this.scene.start(Scenes.GAME, { playerName: name });
      this.rankCount = -250;
      this.scene.start(Scenes.LEVELSELECTOR);
    });
  }
}
