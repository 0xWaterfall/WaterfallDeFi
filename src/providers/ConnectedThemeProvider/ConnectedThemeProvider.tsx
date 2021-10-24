import { ThemeProvider } from "@emotion/react";
import React, { FC, useMemo } from "react";
import { useAppSelector } from "store";
import theme from "styles/theme";

const ConnectedThemeProvider: FC = ({ children }) => {
  const colorMode = useAppSelector((state) => state.selectedKeys.theme);
  const themeObject = useMemo(() => theme(colorMode), [colorMode]);

  return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
};

export default ConnectedThemeProvider;
