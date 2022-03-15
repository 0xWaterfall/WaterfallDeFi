import { BASE_AVAX_SCAN_URL, BASE_BSC_SCAN_URL } from "config";
import { nodes, BNBnodes } from "./getRpcUrl";

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (network: string) => {
  const provider = window.ethereum;
  if (provider?.request) {
    const chainId = parseInt(
      (network === "avax" ? process.env.REACT_APP_CHAIN_ID : process.env.REACT_APP_BNB_CHAIN_ID) ?? "",
      10
    );
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: network === "avax" ? "Avalanche" : "BNB Chain",
            nativeCurrency: {
              name: network === "avax" ? "AVAX" : "BNB",
              symbol: network === "avax" ? "AVAX" : "BNB",
              decimals: 18
            },
            rpcUrls: network === "avax" ? nodes : BNBnodes,
            blockExplorerUrls: [`${network === "avax" ? BASE_AVAX_SCAN_URL : BASE_BSC_SCAN_URL}/`]
          }
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error("Can't setup the " + network + " network on metamask because window.ethereum is undefined");
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string
) => {
  const tokenAdded = await window.ethereum?.request?.({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage
      }
    }
  });

  return tokenAdded;
};
