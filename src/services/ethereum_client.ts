import algosdk from "algosdk";
import Web3 from "web3";

const supportedNetworks: any = {
  localhost: {},
  Goerli: {},
  MainNet: {},
};

export class EthereumClient {
  static ethereumClientInstance: any;
  // static indexerInstance: any;

  static connectEthereumClient(network: string) {
    try {
      // const algodClient = new algosdk.Algodv2(
      //   network === "localhost"
      //     ? supportedNetworks[network]?.algod.token
      //     : {
      //         "X-API-key": supportedNetworks[network]?.algod.token,
      //       },
      //   supportedNetworks[network]?.algod.server,
      //   supportedNetworks[network]?.algod.port
      // );

      EthereumClient.ethereumClientInstance = new Web3(
        "https://prettiest-withered-model.ethereum-goerli.discover.quiknode.pro/1e21d2d24cf75481f03311a5a652a4963e05ace4/"
      );
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static setEthereumClient(network: string) {
    EthereumClient.connectEthereumClient(network);
  }

  // static async connectIndexer(network: string) {
  //   try {
  //     const indexerClient = new algosdk.Indexer(
  //       network === "localhost"
  //         ? supportedNetworks[network]?.indexer.token
  //         : {
  //             "X-API-key": supportedNetworks[network]?.indexer.token,
  //           },
  //       supportedNetworks[network]?.indexer.server,
  //       supportedNetworks[network]?.indexer.port
  //     );

  //     EthereumClient.indexerInstance = indexerClient;
  //   } catch (err: any) {
  //     console.log(err.stack);
  //   }
  // }

  // static setIndexer(network: string) {
  //   EthereumClient.connectIndexer(network);
  // }

  static getEthereumClient(network: string): Web3 {
    if (EthereumClient.ethereumClientInstance) {
      return EthereumClient.ethereumClientInstance;
    } else {
      EthereumClient.connectEthereumClient(network);
      return EthereumClient.ethereumClientInstance;
    }
  }
}
