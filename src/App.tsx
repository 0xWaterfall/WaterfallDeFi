import React, { FC } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { Router } from "react-router-dom";
import { history } from "utils/history";
import Global from "styles/global";
import Reset from "styles/global/Reset";
import ConnectedIntlProvider from "providers/ConnectedIntlProvider/ConnectedIntlProvider";
import "styles/fonts.css";
import Layout from "pages/Layout/Layout";
import { ThemeProvider } from "@emotion/react";
import theme from "styles/theme";

const App: FC = () => {
  return (
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
  );
};

export default App;
