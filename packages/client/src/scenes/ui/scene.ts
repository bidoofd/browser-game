import { Scenes } from "../../types";
import { GameSceneEvents } from "../game";
import { PlayerCountUI } from "./player-count";
import { ChatUI } from "./chat";
import { TimerUI } from "./timer";
import { Socket } from "socket.io-client";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: Scenes.UI,
  active: false,
  visible: false,
};

export default class UIScene extends Phaser.Scene {
  private playerCountUI?: PlayerCountUI;
  private chatUI?: ChatUI;
  private timer!: TimerUI;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const gameScene = this.scene.get(Scenes.GAME);

    this.chatUI = new ChatUI({
      scene: this,
    });

    this.timer = new TimerUI({
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

    gameScene.events.on(GameSceneEvents.UPDATE_TIMER, () => {
      this.timer.updateTimer();
    });

    gameScene.events.on(GameSceneEvents.GET_TIMER, () => {
      this.timer.getTimer();
    });

    gameScene.events.on(GameSceneEvents.PLAYER_WIN, (socket: Socket) => {
      this.scene.start(Scenes.LEADERBOARD, socket);
    });
  }
}
