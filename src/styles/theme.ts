const theme = {
  gray: {
    light: "#FAFAFA",
    normal: "#333333",
    normal04: "rgba(51, 51, 51, 0.04)",
    normal08: "rgba(51, 51, 51, 0.08)",
    normal3: "rgba(51, 51, 51, 0.3)",
    normal5: "rgba(51, 51, 51, 0.5)",
    normal7: "rgba(51, 51, 51, 0.7)",
    normal85: "rgba(51, 51, 51, 0.85)"
  },
  primary: {
    lightBrown: "#F5FAFF",
    light: "#048FFF",
    normal: "#167BFF",
    deep: "#0066FF",
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
    primary: "linear-gradient(360deg, #1579FF 0%, #157BFF 100%)",
    theme: "linear-gradient(156.01deg, rgba(22, 143, 255, 0.05) 14.83%, rgba(255, 255, 255, 0) 40.87%)"
  },
  shadow: {
    primary: "0px 4px 10px rgba(15, 96, 227, 0.1)",
    claim: "inset 0px 4px 10px rgba(79, 153, 250, 0.1), inset 0px 4px 10px rgba(0, 109, 255, 0.1)"
  },
  filter: {
    primary: "drop-shadow(0px 10px 20px rgba(15, 96, 227, 0.04))"
  }
};

export type ITheme = typeof theme;
export default theme;
