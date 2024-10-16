import { Scenes } from "../../types";
import { GameSceneEvents } from "../game";
import { PlayerCountUI } from "./player-count";
import { ChatUI } from "./chat";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: Scenes.UI,
  active: false,
  visible: false,
};

export default class UIScene extends Phaser.Scene {
  private playerCountUI?: PlayerCountUI;
  private chatUI?: ChatUI;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const gameScene = this.scene.get(Scenes.GAME);

    this.chatUI = new ChatUI({
      scene: this,
    });

    gameScene.events.on(GameSceneEvents.PLAYER_JOINED, (playerName: string) => {
      this.chatUI?.addMessage(`${playerName} joined the game`);
    });

    gameScene.events.on(GameSceneEvents.PLAYER_LEFT, (playerName: string) => {
      this.chatUI?.addMessage(`${playerName} left the game`);
    });

    gameScene.events.on(
      GameSceneEvents.INITIALIZE_PLAYER_COUNT,
      (playerCount: number) => {
        this.playerCountUI = new PlayerCountUI({
          scene: this,
          playerCount,
        });
      }
    );

    gameScene.events.on(
      GameSceneEvents.UPDATE_PLAYER_COUNT,
      (playerCount: number) => {
        this.playerCountUI?.updatePlayerCount(playerCount);
      }
    );
  }
}
