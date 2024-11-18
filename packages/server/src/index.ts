import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

import {
  TClientToServerEvents,
  TServerToClientEvents,
} from "@speedrun-browser-game/common/build/types";
import { startGame } from "./game";

import { Request, Response } from "express";
import { AppDataSource } from "./database/data-source";
import { Routes } from "./database/routes";
import { User } from "./database/entity/User";
import bodyParser from "body-parser";

import { port } from "./database/config";

import morgan from "morgan";
import { validationResult } from "express-validator";

// Only require .env files in development or testing environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

function handleError(err: any, req: any, res: any, next: any) {
  res.status(err.statuscode || 500).send({ message: err.message });
}

// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 3200;

// app.get("/", async (_req, res) => {
//   const healthcheck = {
//     uptime: process.uptime(),
//     message: "OK",
//     timestamp: Date.now(),
//   };
//   try {
//     res.send(healthcheck);
//   } catch (error) {
//     healthcheck.message = error as any;
//     res.status(503).send();
//   }
// });

// const io = new SocketServer<TClientToServerEvents, TServerToClientEvents>(
//   server,
//   {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   }
// );

// startGame(io);

// server.listen(PORT, () => {
//   console.log(`Listening on *:${PORT}`);
// });

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    const server = http.createServer(app);
    const PORT = process.env.PORT || 3200;
    app.use(morgan("combined"));
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        ...route.validation,
        async (req: Request, res: Response, next: Function) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            res.json(result);
          } catch (error) {
            next(error);
          }
        }
      );
    });

    // setup express app here
    app.get("/", async (_req, res) => {
      const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
      };
      try {
        res.send(healthcheck);
      } catch (error) {
        healthcheck.message = error as any;
        res.status(503).send();
      }
    });

    const io = new SocketServer<TClientToServerEvents, TServerToClientEvents>(
      server,
      {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      }
    );

    startGame(io);

    server.listen(PORT, () => {
      console.log(`Listening on *:${PORT}`);
    });

    // start express server
    app.use(handleError);
    app.listen(port);

    // insert new users for test
    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27,
      })
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24,
      })
    );

    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
