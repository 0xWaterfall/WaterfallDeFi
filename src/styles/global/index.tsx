import { Global } from "@emotion/react";

export default () => {
  return (
    <Global
      styles={{
        "html, body, #root": {
          fontSize: 14,
          fontFamily: "Regular",
          overflowX: "hidden",
          width: "100vw",
          height: "100vh"
        },
        "*": {
          fontFamily: "Regular",
          boxSizing: "border-box"
        },
        "::selection": {
          // backgroundColor: plain.normal
        },
        "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0
        },
        "input[type=number]": {
          mozAppearance: "textfield"
        }
      }}
    />
  );
};
