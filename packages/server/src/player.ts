import { v4 as uuidv4 } from "uuid";
import matter from "matter-js";

import {
  TPlayerInput,
  ECursorKey,
  PLAYER_SIZE,
  TPlayer,
  getPlayerVelocity,
} from "@speedrun-browser-game/common/build/modules/player";
import { getDirectionFromInputKeys } from "@speedrun-browser-game/common/build/utils/input";
import { Direction } from "@speedrun-browser-game/common/build/types";

import { getValidBodyPosition } from "./map";

export const getPlayersPublicData = (
  players: Record<string, Player>
): Record<string, TPlayer> => {
  const playersPublicData: Record<string, TPlayer> = {};

  for (const playerId in players) {
    const player = players[playerId];
    playersPublicData[playerId] = player.getPublicData();
  }

  return playersPublicData;
};

export class Player {
  id: string;
  lastProcessedInput: number;
  body: matter.Body;
  direction: Direction;
  name: string;

  world: matter.World;
  players: Record<string, Player>;

  constructor(
    world: matter.World,
    players: Record<string, Player>,
    name: string
  ) {
    this.id = uuidv4();
    this.lastProcessedInput = 0;
    this.direction = Direction.DOWN;
    this.name = name;

    this.players = players;
    this.world = world;

    const initialPosition = getValidBodyPosition(world, PLAYER_SIZE);
    this.body = matter.Bodies.rectangle(
      initialPosition.x,
      initialPosition.y,
      PLAYER_SIZE,
      PLAYER_SIZE,
      {
        inverseInertia: 0, // Prevent body from rotating
        collisionFilter: {
          group: -1,
        },
      }
    );
    matter.Composite.add(world, this.body);
  }

  processInput(
    input: TPlayerInput,
    delta: number,
    players: Record<string, Player>
  ): void {
    const direction = getDirectionFromInputKeys(input.keys);

    if (direction) {
      this.direction = direction;

      const newVelocity = getPlayerVelocity({
        delta,
        direction,
      });
      matter.Body.setVelocity(this.body, newVelocity);
    }
  }

  getPublicData(): TPlayer {
    const position = {
      x: this.body.position.x,
      y: this.body.position.y,
    };

    return {
      position,
      lastProcessedInput: this.lastProcessedInput,
      name: this.name,
    };
  }

  destroy(): void {
    matter.World.remove(this.world, this.body);
    delete this.players[this.id];
  }
}
