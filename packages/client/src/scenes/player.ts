import { TVector2 } from "@speedrun-browser-game/common/src/modules/math";
import {
  TPlayer,
  TPlayers,
  getPlayerVelocity,
  ECursorKey,
} from "@speedrun-browser-game/common/src/modules/player";
import { Direction } from "@speedrun-browser-game/common/src/types";
import { getDirectionFromInputKeys } from "@speedrun-browser-game/common/src/utils/input";

import smiley from "url:../assets/characters/smiley.png";

import { getDirectionFromPosition } from "../utils/animations";
import { gameConfig } from "./ui/config";
import { GameAssets } from "../types";

enum PlayerAssets {
  PLAYER_SPRITES = "playerSprites",
}

export class PlayersManager {
  scene: Phaser.Scene;
  players: Phaser.GameObjects.Group;
  currentPlayer?: Player;

  constructor({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;
    this.players = this.scene.add.group();
  }

  initializePlayers(currentPlayerId: string, players: TPlayers): void {
    this.players.clear(true, true);

    for (const playerId in players) {
      const player = players[playerId];
      const newPlayer = new Player({
        scene: this.scene,
        id: playerId,
        position: player.position,
        name: player.name,
      });
      this.players.add(newPlayer);

      // Set reference to current player
      if (currentPlayerId === playerId) {
        this.currentPlayer = newPlayer;
      }
    }
  }

  updatePlayers({
    playersUpdate,
    isPlayerAlreadyDead,
    handlePlayerDeath,
  }: {
    playersUpdate: TPlayers;
    isPlayerAlreadyDead: boolean;
    handlePlayerDeath: () => void;
  }): void {
    (this.players.getChildren() as Player[]).forEach((player) => {
      const isCurrentPlayer = player.id === this.currentPlayer?.id;
      const playerUpdate = playersUpdate[player.id];

      // If there is no update it means the player is dead
      const isPlayerAlive = !!playerUpdate;

      if (isCurrentPlayer && isPlayerAlreadyDead) return;

      if (isPlayerAlive) {
        // Only update animations for other players (current player animation is already handled)
        if (!isCurrentPlayer) {
          const inputMovementDirection = getDirectionFromPosition(
            { x: player.x, y: player.y },
            playerUpdate.position
          );
        }

        player.setPosition(playerUpdate.position.x, playerUpdate.position.y);
        player.setDepth(playerUpdate.position.y);
      } else {
        if (isCurrentPlayer) {
          if (player) {
            handlePlayerDeath();
          }
        } else {
          player.die();
        }
      }
    });
  }

  addPlayer(playerId: string, player: TPlayer): void {
    const newPlayer = new Player({
      scene: this.scene,
      id: playerId,
      position: player.position,
      name: player.name,
    });
    this.players.add(newPlayer);
  }

  removePlayer(playerId: string): void {
    this.players.getChildren().forEach((player) => {
      if (player.id === playerId) {
        player.destroy();
      }
    });
  }
}

export class Player extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  id: string;
  playerSprite: Phaser.GameObjects.Sprite;
  body!: MatterJS.BodyType;
  name: string;

  // Store collision direction to prevent sending invalid player movement to the server
  collisionDirection?: Direction;

  constructor({
    scene,
    id,
    position,
    name,
  }: {
    scene: Phaser.Scene;
    id: string;
    position: TVector2;
    name: string;
  }) {
    super(scene, position.x, position.y, []);
    scene.add.existing(this);

    this.playerSprite = scene.add.sprite(0, 0, PlayerAssets.PLAYER_SPRITES);

    console.log("this", this);
    this.playerSprite.setDisplaySize(16, 16);
    this.setSize(16, 16);
    console.log("playersprite", this.playerSprite);
    scene.matter.add.gameObject(this);
    // Prevent body from rotating
    this.body.inverseInertia = 0;
    this.body.collisionFilter.group = -1;

    this.body.onCollideActiveCallback = ({
      collision,
    }: {
      collision: { normal: TVector2 };
    }) => {
      if (collision.normal.x > 0) {
        this.collisionDirection = Direction.RIGHT;
      } else if (collision.normal.x < 0) {
        this.collisionDirection = Direction.LEFT;
      } else if (collision.normal.y > 0) {
        this.collisionDirection = Direction.DOWN;
      } else if (collision.normal.y < 0) {
        this.collisionDirection = Direction.UP;
      }
    };

    this.body.onCollideEndCallback = () => {
      this.collisionDirection = undefined;
    };

    const playerName = scene.add
      .bitmapText(0, -20, GameAssets.TYPOGRAPHY, name)
      .setOrigin(0.5)
      .setScale(0.25)
      .setTintFill(0xffffff);

    this.add([this.playerSprite, playerName]);

    this.scene = scene;
    this.id = id;
    this.name = name;
  }

  static preloadAssets(scene: Phaser.Scene): void {
    scene.load.image(PlayerAssets.PLAYER_SPRITES, smiley);
  }

  update({ keys, delta }: { keys: ECursorKey[]; delta: number }): void {
    // Set correct depth rendering depending on y position
    this.setDepth(this.body.position.y);

    const inputMovementDirection = getDirectionFromInputKeys(keys);

    if (gameConfig.clientSidePrediction) {
      const newVelocity = getPlayerVelocity({
        delta,
        direction: inputMovementDirection,
      });
      this.scene.matter.setVelocity(this.body, newVelocity.x, newVelocity.y);
    }
  }

  hit(): void {
    this.scene.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 150,
      yoyo: true,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.playerSprite.setTint(
          Phaser.Display.Color.GetColor(255, value, value)
        );
      },
      onComplete: () => {
        this.playerSprite.clearTint();
      },
    });
  }

  die(): void {
    this.scene.tweens.addCounter({
      from: 0,
      to: 255,
      duration: 400,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.playerSprite.setTint(
          Phaser.Display.Color.GetColor(value, value, value)
        );
      },
      onComplete: () => {
        this.playerSprite.clearTint();
        this.destroy();
      },
    });
  }
}
