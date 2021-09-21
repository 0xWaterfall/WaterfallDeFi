/// <reference types="react-scripts" />

declare module "@loadable/component";
declare module "react-twitter-embed";
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
