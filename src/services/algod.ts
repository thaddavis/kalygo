import algosdk from "algosdk";

const supportedNetworks: any = {
  localhost: {
    algod: {
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      server: "http://localhost",
      port: 4001,
    },
    indexer: {
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      server: "http://localhost",
      port: 8980,
    },
  },
  TestNet: {
    algod: {
      token: "4DDWlske7J1zToVwoFxb2NeDkBiYok82FnsO4mLj",
      server: "https://testnet-algorand.api.purestake.io/ps2",
      port: 443,
    },
    indexer: {
      token: "4DDWlske7J1zToVwoFxb2NeDkBiYok82FnsO4mLj",
      server: "https://testnet-algorand.api.purestake.io/idx2",
      port: 443,
    },
  },
  MainNet: {
    algod: {
      token: "4DDWlske7J1zToVwoFxb2NeDkBiYok82FnsO4mLj",
      server: "https://mainnet-algorand.api.purestake.io/ps2",
      port: 443,
    },
    indexer: {
      token: "4DDWlske7J1zToVwoFxb2NeDkBiYok82FnsO4mLj",
      server: "https://mainnet-algorand.api.purestake.io/idx2",
      port: 443,
    },
  },
};

export class Algod {
  static algodInstance: any;
  static indexerInstance: any;

  static connectAlgod(network: string) {
    try {
      const algodClient = new algosdk.Algodv2(
        network === "localhost"
          ? supportedNetworks[network]?.algod.token
          : {
              "X-API-key": supportedNetworks[network]?.algod.token,
            },
        supportedNetworks[network]?.algod.server,
        supportedNetworks[network]?.algod.port
      );

      Algod.algodInstance = algodClient;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static setAlgod(network: string) {
    Algod.connectAlgod(network);
  }

  static async connectIndexer(network: string) {
    try {
      const indexerClient = new algosdk.Indexer(
        network === "localhost"
          ? supportedNetworks[network]?.indexer.token
          : {
              "X-API-key": supportedNetworks[network]?.indexer.token,
            },
        supportedNetworks[network]?.indexer.server,
        supportedNetworks[network]?.indexer.port
      );

      Algod.indexerInstance = indexerClient;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static setIndexer(network: string) {
    Algod.connectIndexer(network);
  }

  static getAlgod(network: string): algosdk.Algodv2 {
    if (Algod.algodInstance) {
      return Algod.algodInstance;
    } else {
      // console.log("connectAlgod");

      Algod.connectAlgod(network);
      return Algod.algodInstance;
    }
  }

  static getIndexer(network: string): algosdk.Indexer {
    if (Algod.indexerInstance) {
      return Algod.indexerInstance;
    } else {
      // console.log("connectIndexer");

      Algod.connectIndexer(network);
      return Algod.indexerInstance;
    }
  }
}
