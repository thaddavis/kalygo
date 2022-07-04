// const { MongoClient } = require("mongodb")
// import config from "../config"
// console.log(config)
// const connectionString = config.DB_URI;

import algosdk from "algosdk";

const token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = "http://localhost";
const port = 4001;

export class Algod {
  static instance: any;

  static async connect() {
    try {
      const algodClient = new algosdk.Algodv2(token, server, port);

      Algod.instance = algodClient;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static getAlgod() {
    if (Algod.instance) {
      return Algod.instance;
    } else {
      Algod.connect();
      return Algod.instance;
    }
  }
}
