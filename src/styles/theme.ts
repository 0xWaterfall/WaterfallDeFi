import { Theme } from "@emotion/react";

const theme = {
  gray: {
    normal: "#333333",
    normal04: "rgba(51, 51, 51, 0.04)",
    normal08: "rgba(51, 51, 51, 0.08)",
    normal3: "rgba(51, 51, 51, 0.3)",
    normal5: "rgba(51, 51, 51, 0.5)",
    normal7: "rgba(51, 51, 51, 0.7)",
    normal85: "rgba(51, 51, 51, 0.85)"
  },
  primary: {
    normal: "#167BFF",
    deep: "#006FFF",
    deep2: "rgba(0, 111, 255, 0.2)"
  },
  warn: {
    normal: "#FCB500",
    deep: "#F0603C"
  },
  white: {
    normal: "#FFFFFF"
  },
  linearGradient: {
    primary: "linear-gradient(360deg, #1579FF 0%, #157BFF 100%)"
  },
  shadow: {
    primary: "0px 4px 10px rgba(15, 96, 227, 0.1)"
  }
};

export type ITheme = typeof theme & Theme;
export default theme;
