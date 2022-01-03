import { BIG_TEN } from "utils/bigNumber";
import { gql } from "@apollo/client";

export const PUBLIC_URL = process.env.PUBLIC_URL || "";

export const I18N = PUBLIC_URL + "/i18n/";

export const url = {
  metamask: "https://metamask.io/"
};

export const isPod = process.env.NODE_ENV;

export const languages = [
  { name: "English", code: "en" },
  { name: "简体中文", code: "zh-CN" }
];

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 200000;
export const DEFAULT_GAS_PRICE = 5;

export const USER_INVESTS_GQL = gql`
  {
    userInvests(first: 1000) {
      id
      owner
      tranche
      cycle
      principal
      capital
      investAt
      harvestAt
    }
  }
`;
export const NETWORKS = {
  DEVNET: "DEVNET",
  TESTNET: "TESTNET",
  MAINNET: "MAINNET"
} as const;
export type NETWORKS_TYPE = typeof NETWORKS[keyof typeof NETWORKS];
export const NETWORK = process.env.REACT_APP_NETWORK as NETWORKS_TYPE;
console.log("connected to", NETWORK);

export const BASE_BSC_SCAN_URL = NETWORK === NETWORKS.MAINNET ? "https://snowtrace.io" : "https://snowtrace.io";
