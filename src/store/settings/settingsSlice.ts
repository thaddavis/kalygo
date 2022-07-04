import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type SupportedNetworks = "MainNet" | "TestNet" | "localhost";

// Define a type for the slice state
interface SettingsState {
  selectedNetwork: SupportedNetworks;
  supportedNetworks: string[];
  accounts: any[];
  selectedAccount: string;
}

interface SettingsStateForSpread {
  network?: SupportedNetworks;
  supportedNetworks?: string[];
  accounts?: any[];
  selectedAccount?: string;
}

// Define the initial state using that type
const initialState: SettingsState = {
  selectedNetwork: "localhost",
  supportedNetworks: ["MainNet", "TestNet", "localhost"],
  accounts: [],
  selectedAccount: "T4N73AL4F4ZL6VJZWJ2QP2KV5VJEHJYFTFMVNTWG45MP4S4EDPJIWC45WI",
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
          network,
          accounts,
        };
      } catch (e) {
        console.error(e);

        return {
          network,
          accounts: [],
        };
      }
    } else {
      console.error("NO AlgoSigner");

      return {
        network,
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
    changeNetwork: (
      state: SettingsState,
      action: PayloadAction<SupportedNetworks>
    ) => {
      state.selectedNetwork = action.payload;
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
        state.accounts = action.payload.accounts;
        // state.selectedAccount =
        //   action.payload.accounts.length > 0
        //     ? action.payload.accounts[0].address
        //     : "";
        // state.selectedNetwork = action.payload.network as SupportedNetworks;
      }
    );
  },
});

export const { changeNetwork, updateState } = settingsSlice.actions;

export default settingsSlice.reducer;
