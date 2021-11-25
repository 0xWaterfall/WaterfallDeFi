import React, { FC } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { Router } from "react-router-dom";
import { history } from "utils/history";
import Global from "styles/global";
import ConnectedIntlProvider from "providers/ConnectedIntlProvider/ConnectedIntlProvider";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "utils/web3React";
import Reset from "styles/global/Reset";
import ConnectedDataProvider from "providers/ConnectedDataProvider/ConnectedDataProvider";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { RefreshContextProvider } from "contexts/RefreshContext";
import { PersistGate } from "redux-persist/integration/react";
import ConnectedThemeProvider from "providers/ConnectedThemeProvider/ConnectedThemeProvider";
import Pages from "pages/Pages";
import ConnectedApolloClientProvider from "providers/ConnectedApolloClientProvider/ConnectedApolloClientProvider";

const client = new ApolloClient({
  // uri: "https://api.studio.thegraph.com/query/7076/waterfall-subgraph/v0.0.9",
  // uri: "https://subgraph-test.icarus.finance/subgraphs/name/ica/waterfall-subgraph",
  // uri: "https://api.waterfalldefi.org/subgraphs/name/ica/waterfall-subgraph",
  uri: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/waterfall-subgraph-prod",
  cache: new InMemoryCache()
});

const App: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedDataProvider>
            {/* <ConnectedApolloClientProvider> */}
            <ConnectedIntlProvider>
              <Router history={history}>
                <ConnectedThemeProvider>
                  <RefreshContextProvider>
                    <Reset />
                    <Global />
                    <Pages />
                  </RefreshContextProvider>
                </ConnectedThemeProvider>
              </Router>
            </ConnectedIntlProvider>
            {/* </ConnectedApolloClientProvider> */}
          </ConnectedDataProvider>
        </PersistGate>
      </Provider>
    </Web3ReactProvider>
  );
};

export default App;
