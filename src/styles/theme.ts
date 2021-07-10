import { Theme } from "@emotion/react";

const theme = {
  fonts: {
    regular: "Regular",
    Medium: "Medium",
    Bold: "Bold"
  },
  gray: {
    normal: "#333333",
    normal3: "rgba(51, 51, 51, 0.3)",
    normal7: "rgba(51, 51, 51, 0.7)"
  },
  primary: {
    normal: "#167BFF",
    deep: "#006FFF",
    deep2: "rgba(0, 111, 255, 0.2)"
  },
  warn: {
    normal: "#FCB500"
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
