import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Router } from "react-router-dom";
import { history } from "utils/history";
import Global from "styles/global";
import ConnectedIntlProvider from "providers/ConnectedIntlProvider/ConnectedIntlProvider";
import "styles/fonts.css";
import Layout from "pages/Layout/Layout";
import { ThemeProvider } from "@emotion/react";
import theme from "styles/theme";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "utils/web3React";
import Reset from "styles/global/Reset";

const App: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router history={history}>
        <Provider store={store}>
          <ConnectedIntlProvider>
            <ThemeProvider theme={theme}>
              <Reset />
              <Global />
              <Layout />
            </ThemeProvider>
          </ConnectedIntlProvider>
        </Provider>
      </Router>
    </Web3ReactProvider>
  );
};

export default App;
