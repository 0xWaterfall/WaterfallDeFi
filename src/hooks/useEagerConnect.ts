import { useEffect } from "react";
import { ConnectorNames } from "schemas/enum";
import useAuth from "utils/useAuth";

// const _binanceChainListener = async () =>
//   new Promise<void>((resolve) =>
//     Object.defineProperty(window, "BinanceChain", {
//       get() {
//         return this.bsc;
//       },
//       set(bsc) {
//         this.bsc = bsc;

//         resolve();
//       }
//     })
//   );

const useEagerConnect = (network: string) => {
  const { login } = useAuth(network);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorIdv2") as ConnectorNames;
    if (connectorId) {
      //   const isConnectorBinanceChain = connectorId === ConnectorNames.BSC;
      //   const isBinanceChainDefined = Reflect.has(window, "BinanceChain");

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      //   if (isConnectorBinanceChain && !isBinanceChainDefined) {
      //     _binanceChainListener().then(() => login(connectorId));

      //     return;
      //   }

      login(connectorId);
    }
  }, [login]);
};

export default useEagerConnect;
