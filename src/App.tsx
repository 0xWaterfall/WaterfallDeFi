import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Router } from "react-router-dom";
import { history } from "utils/history";
import Global from "styles/global";
import ConnectedIntlProvider from "providers/ConnectedIntlProvider/ConnectedIntlProvider";
import Layout from "pages/Layout/Layout";
import { ThemeProvider } from "@emotion/react";
import theme from "styles/theme";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "utils/web3React";
import Reset from "styles/global/Reset";
import ConnectedDataProvider from "providers/ConnectedDataProvider/ConnectedDataProvider";

const App: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ConnectedDataProvider>
          <ConnectedIntlProvider>
            <Router history={history}>
              <ThemeProvider theme={theme}>
                <Reset />
                <Global />
                <Layout />
              </ThemeProvider>
            </Router>
          </ConnectedIntlProvider>
        </ConnectedDataProvider>
      </Provider>
    </Web3ReactProvider>
  );
};

export default App;
