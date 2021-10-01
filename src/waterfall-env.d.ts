import "@emotion/react";
import { ITheme } from "styles/theme";

declare module "@loadable/component";

declare module "react-twitter-embed";

/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "@emotion/react" {
  export interface Theme extends ITheme {}
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: Function;
    ethereum?: {
      isMetaMask?: true;
      request?: (...args: any[]) => Promise<void>;
      on?: (...args: any[]) => void;
      removeListener?: (...args: any[]) => void;
      autoRefreshOnNetworkChange?: boolean;
      chainId: string;
    };
  }
}
