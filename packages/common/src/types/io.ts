import { TPlayerInput, TPlayer, TPlayers } from "../modules/player";

export enum ESocketEventNames {
  // Server to client
  GameUpdate = "GAME_UPDATE",
  // Client to server
  PlayerInput = "PLAYER_INPUT",
  SendData = "SEND_DATA",
  //SendData = "SEND_DATA",
}

export type TClientToServerEvents = {
  [ESocketEventNames.PlayerInput]: (input: TPlayerInput) => void;
  [ESocketEventNames.SendData]: (name: string, time: string) => void;
  //[ESocketEventNames.SendData]: () => void;
};

export type TServerToClientEvents = {
  [ESocketEventNames.GameUpdate]: (
    gameUpdate:
      | {
          type: "INITIAL_GAME_STATE";
          playerId: string;
          players: TPlayers;
        }
      | {
          type: "PLAYER_JOINED";
          playerId: string;
          player: TPlayer;
        }
      | {
          type: "PLAYER_LEFT";
          playerId: string;
          player: TPlayer;
        }
      | {
          type: "PLAYER_WIN";
          playerId: string;
          player: TPlayers;
        }
      | {
          type: "GAME_STATE";
          players: TPlayers;
        }
  ) => void;
};
