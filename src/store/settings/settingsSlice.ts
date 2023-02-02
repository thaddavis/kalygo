import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type EmptyNetwork = "";
type SupportedEthereumNetworks = "MainNet" | "TestNet" | "localhost";
type SupportedAlgorandNetworks = "Mainnet" | "Sepolia" | "Goerli" | "localhost";
type SupportedNetworks =
  | EmptyNetwork
  | SupportedEthereumNetworks
  | SupportedAlgorandNetworks;

type SupportedBlockchains = "Algorand" | "Ethereum" | "Solana";

// Define a type for the slice state
interface SettingsState {
  selectedEthereumNetwork: string;
  selectedAlgorandNetwork: string;
  supportedAlgorandNetworks: string[];
  supportedEthereumNetworks: string[];
  supportedBlockchains: string[];
  accountsEthereum: any[];
  accountsAlgorand: any[];
  selectedEthereumAccount: string;
  selectedAlgorandAccount: string;
  selectedBlockchain: string;
}

interface SettingsStateForSpread {
  network?: string[];
  supportedBlockchains?: string[];
  supportedNetworks?: string[];
  accounts?: any[];
  selectedAccount?: string;
  selectedEthereumNetwork?: string;
  selectedAlgorandNetwork?: string;
  selectedBlockchain?: string;
}

// Define the initial state using that type
const initialState: SettingsState = {
  selectedEthereumNetwork: "Goerli",
  selectedAlgorandNetwork: "TestNet",
  // selectedAlgorandNetwork: "localhost",
  supportedAlgorandNetworks: ["MainNet", "TestNet", "localhost"],
  supportedEthereumNetworks: ["Mainnet", "Sepolia", "Goerli", "localhost"],
  supportedBlockchains: [
    "Ethereum",
    // "Polygon",
    // "Cardano",
    "Algorand",
    // "Avalanche",
    // "Solana",
  ],
  accountsEthereum: [],
  accountsAlgorand: [],
  // selectedAccount: "T4N73AL4F4ZL6VJZWJ2QP2KV5VJEHJYFTFMVNTWG45MP4S4EDPJIWC45WI",
  // selectedAccount: "RHKHUONCBB7JOIQ2RDCSV3NUX5JFKLLOG2RKN4LRIJ6DQMAIBTFLLO72DM",
  // selectedAlgorandAccount:
  //   "F2BLSIT7DMRXBVE6OT53U3UNTN7KAF36LW5AW6SOBKJSKTMCMXRATIU64A",
  selectedAlgorandAccount:
    "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
  selectedEthereumAccount: "",
  // selectedAlgorandAccount:
  // "F2BLSIT7DMRXBVE6OT53U3UNTN7KAF36LW5AW6SOBKJSKTMCMXRATIU64A", // localhost
  // selectedBlockchain: "Algorand",
  selectedBlockchain: "Algorand",
  // selectedAccount: "QHGMAMCTEHZ2RQV2DRXSPAKIIT3REVK46CHNDJSW6WNXJLSJ7BB76NHDGY",
  // selectedAccount: "",
};

export const fetchAlgoSignerNetworkAccounts = createAsyncThunk(
  "algosigner/fetchNetworkAccounts",
  async (network: string, thunkAPI) => {
    console.log("->", network, thunkAPI);

    if (typeof (window as any).AlgoSigner !== "undefined") {
      console.log("window.AlgoSigner", (window as any).AlgoSigner);

      try {
        let accounts = await (window as any).AlgoSigner.accounts({
          ledger: network,
        });

        return {
          // network,
          accounts,
        };
      } catch (e) {
        console.error(e);

        return {
          // network,
          accounts: [],
        };
      }
    } else {
      console.error("NO AlgoSigner");

      return {
        // network,
        accounts: [],
      };
    }
  }
);

export const fetchMetamaskNetworkAccounts = createAsyncThunk(
  "metamask/fetchNetworkAccounts",
  async (thunkAPI) => {
    console.log("***--->>>", thunkAPI);

    if (typeof (window as any).ethereum !== "undefined") {
      // ethereum.request({ method: 'eth_requestAccounts' });

      console.log("window.ethereum", (window as any).ethereum);
      try {
        let accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("accounts", accounts);

        return {
          // network,
          accounts: accounts,
        };
      } catch (e) {
        console.error(e);
        return {
          // network,
          accounts: [],
        };
      }
    } else {
      console.error("NO Metamask");

      return {
        // network,
        accounts: [],
      };
    }
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeEthereumNetwork: (
      state: SettingsState,
      action: PayloadAction<SupportedNetworks>
    ) => {
      state.selectedEthereumNetwork = action.payload;
    },
    changeAlgorandNetwork: (
      state: SettingsState,
      action: PayloadAction<SupportedNetworks>
    ) => {
      state.selectedAlgorandNetwork = action.payload;
    },
    updateState: (
      state: SettingsState,
      action: PayloadAction<SettingsStateForSpread>
    ) => {
      state = {
        ...state,
        ...action.payload,
      };

      return state;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchAlgoSignerNetworkAccounts.fulfilled,
      (state, action) => {
        // Add user to the state array
        // state.entities.push(action.payload);
        state.accountsAlgorand = action.payload.accounts;
        // state.selectedAccount =
        //   action.payload.accounts.length > 0
        //     ? action.payload.accounts[0].address
        //     : "";
        // state.selectedNetwork = action.payload.network as SupportedNetworks;
      }
    );

    builder.addCase(fetchMetamaskNetworkAccounts.fulfilled, (state, action) => {
      // Add user to the state array
      // state.entities.push(action.payload);
      state.accountsEthereum = action.payload.accounts;
      // state.selectedAccount =
      //   action.payload.accounts.length > 0
      //     ? action.payload.accounts[0].address
      //     : "";
      // state.selectedNetwork = action.payload.network as SupportedNetworks;
    });
  },
});

export const { changeEthereumNetwork, changeAlgorandNetwork, updateState } =
  settingsSlice.actions;

export default settingsSlice.reducer;
