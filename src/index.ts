import express from "express";
import { providers } from "ethers";
import { contractEventService } from "./listeners/web3";
import { BridgeEventService } from "./listeners/bridge";
import { elrondEventListener } from "./listeners/elrond";
import { tezosEventListener } from "./listeners/tezos";
import config from "./config";
import { MikroORM } from "@mikro-orm/core";
import cors from "cors";
import createEventRepo from "./db/repo";
import { txRouter } from "./routes/tx";
import {explorerDB, indexerDb} from "./mikro-orm.config";
import axios from "axios";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import createNFTRepo from "./db/indexerRepo";
import IndexUpdater from "./services/indexUpdater"



const cron = require("node-cron");

export let io: Server;

export default (async function main() {


  
  const app = express();
  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const orm = await MikroORM.init(explorerDB);
  const indexerOrm = await MikroORM.init(indexerDb);
  const txRoutes = txRouter(createEventRepo(orm));

  new IndexUpdater(createNFTRepo(indexerOrm))

  await IndexUpdater.instance.createDefault()
  app.use("/", txRoutes);

  //const x = await IndexUpdater.instance.getDestTrxInfo('0x751af7ce2783214efb40c3129cee233f0955cc56764f47ef2424137a186fb2c2', 'BSC');

  BridgeEventService(createEventRepo(orm)).listen();;

  // config.web3.map((chain) =>
  //   contractEventService(
  //     new providers.JsonRpcProvider(chain.node),
  //     chain.contract,
  //     chain.name,
  //     chain.nonce,
  //     chain.id,
  //     createEventRepo(orm),
  //     axios
  //   ).listen()
  // );

  elrondEventListener(
    config.elrond.node,
    config.elrond.contract,
    config.elrond.name,
    config.elrond.nonce,
    createEventRepo(orm)
  ).listen();

  tezosEventListener(
    config.tezos.socket,
    config.tezos.contract,
    config.tezos.name,
    config.tezos.nonce,
    config.tezos.id,
    createEventRepo(orm)
  ).listen();

  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  server.listen(config.port, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
    const repo = createEventRepo(orm);
    repo.saveDailyData();
    cron.schedule("*/30 * * * *", () => repo.saveDailyData());
  });

  return { server, socket: io, app, eventRepo: createEventRepo(orm) };
})();
