import matter from "matter-js";

import { Direction } from "../../types";
import { ECursorKey } from "./types";
import { PLAYER_VELOCITY } from "./config";

export const getPlayerVelocity = ({
  delta,
  direction,
}: {
  delta: number;
  direction?: Direction;
}) => {
  const newDelta = Math.floor(delta)
  const movement = (newDelta * PLAYER_VELOCITY) / 1000;

  if(direction === Direction.FALLING) {
    return {
      x: 0,
      y: movement * 2
    }
  }

  if(direction === Direction.STILL) {
    return {
      x: 0,
      y: 0
    }
  }

  return {
    x: direction === Direction.LEFT ? -movement * 2.5 : direction === Direction.RIGHT ? movement * 2.5 : 0,
    y: direction === Direction.UP ? -movement * 15 : direction === Direction.DOWN ? movement : 0,
  };
};
