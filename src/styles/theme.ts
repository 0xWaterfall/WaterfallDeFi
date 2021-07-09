import { Theme } from "@emotion/react";

const theme = {
  fonts: {
    regular: "Regular",
    Medium: "Medium",
    Bold: "Bold"
  },
  fontBasic: {
    normal: "#333333",
    normal7: "rgba(51, 51, 51, 0.7)"
  },
  primary: {
    normal: "#167BFF"
  },
  white: {
    normal: "#FFFFFF"
  }
};

export type ITheme = typeof theme & Theme;
export default theme;
