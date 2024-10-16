import matter from "matter-js";
import { Socket, Server as SocketServer } from "socket.io";

import {
  TClientToServerEvents,
  TServerToClientEvents,
  ESocketEventNames,
} from "@speedrun-browser-game/common/build/types";
import { TPlayerInputMessage } from "@speedrun-browser-game/common/build/modules/player";

import { Player, getPlayersPublicData } from "./player";
import { Map } from "./map";
import { createLoop } from "./utils";

const UPDATE_LOOP_RATE_PER_SECOND = 22;

type PlayerMap = Record<string, Player>;

function handleNewPlayerJoined({
  engine,
  socket,
  name,
  players,
}: {
  engine: Matter.Engine;
  socket: Socket<TClientToServerEvents, TServerToClientEvents>;
  name: string;
  players: PlayerMap;
}) {
  const player = new Player(engine.world, players, name);

  // Add new player to player list
  players[player.id] = player;

  // Send the player list to the recently connected player with their playerId
  socket.emit(ESocketEventNames.GameUpdate, {
    type: "INITIAL_GAME_STATE",
    players: getPlayersPublicData(players),
    playerId: player.id,
  });

  // Send the new player to the rest of players
  socket.broadcast.emit(ESocketEventNames.GameUpdate, {
    type: "PLAYER_JOINED",
    playerId: player.id,
    player: player.getPublicData(),
  });

  return player;
}

export function startGame(
  io: SocketServer<TClientToServerEvents, TServerToClientEvents>
): void {
  let inputMessages: TPlayerInputMessage[] = [];

  // Initialize matter.js physics engine
  const engine = matter.Engine.create({
    gravity: { x: 0, y: 0 },
  });
  const runner = matter.Runner.create();
  matter.Runner.run(runner, engine);

  new Map(engine.world);

  // Game state
  const players: PlayerMap = {};

  matter.Events.on(runner, "afterTick", (event) => {
    const delta = event.source.delta;

    // Restart players velocity on each tick
    Object.keys(players).forEach((playerId) => {
      const player = players[playerId];
      matter.Body.setVelocity(player.body, { x: 0, y: 0 });
    });

    inputMessages.forEach(({ playerId, input }) => {
      const player = players[playerId];
      if (player) {
        player.processInput(input, delta, players);
        player.lastProcessedInput = input.inputNumber;
      }
    });
    inputMessages = [];
  });

  io.on("connection", (socket) => {
    const newPlayerName =
      (socket.handshake.query?.playerName as string) ?? "RANDOM_PLAYER";

    let player = handleNewPlayerJoined({
      engine,
      socket,
      name: newPlayerName,
      players,
    });

    socket.on("disconnect", () => {
      delete players[player.id];
      socket.broadcast.emit(ESocketEventNames.GameUpdate, {
        type: "PLAYER_LEFT",
        playerId: player.id,
        player: player.getPublicData(),
      });
    });

    socket.on(ESocketEventNames.PlayerInput, (input) => {
      inputMessages.push({
        playerId: player.id,
        input,
      });
    });

    socket.on(ESocketEventNames.RestartGame, () => {
      player = handleNewPlayerJoined({
        engine,
        socket,
        name: newPlayerName,
        players,
      });
    });
  });

  createLoop(1000 / UPDATE_LOOP_RATE_PER_SECOND, () => {
    io.emit(ESocketEventNames.GameUpdate, {
      type: "GAME_STATE",
      players: getPlayersPublicData(players),
    });
  });
}
