declare module "@loadable/component";

declare module "react-twitter-embed";

declare global {
  import "@emotion/react";
  import { ITheme } from "styles/theme";
  declare module "@emotion/react" {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    export interface Theme extends ITheme {}
  }
}

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
