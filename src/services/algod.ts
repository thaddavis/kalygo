// const { MongoClient } = require("mongodb")
// import config from "../config"
// console.log(config)
// const connectionString = config.DB_URI;

import algosdk from "algosdk";

const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;

const indexerToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const indexerServer = "http://localhost";
const indexerPort = 8980;

export class Algod {
  static algodInstance: any;
  static indexerInstance: any;

  static async connectAlgod() {
    try {
      const algodClient = new algosdk.Algodv2(
        algodToken,
        algodServer,
        algodPort
      );

      Algod.algodInstance = algodClient;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static async connectIndexer() {
    try {
      const indexerClient = new algosdk.Indexer(
        indexerToken,
        indexerServer,
        indexerPort
      );

      Algod.indexerInstance = indexerClient;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static getAlgod(): algosdk.Algodv2 {
    if (Algod.algodInstance) {
      return Algod.algodInstance;
    } else {
      Algod.connectAlgod();
      return Algod.algodInstance;
    }
  }

  static getIndexer(): algosdk.Indexer {
    if (Algod.indexerInstance) {
      return Algod.indexerInstance;
    } else {
      Algod.connectIndexer();
      return Algod.indexerInstance;
    }
  }
}
