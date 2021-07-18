import { Global, useTheme } from "@emotion/react";

export default () => {
  const { gray, primary, linearGradient } = useTheme();
  return (
    <Global
      styles={{
        "html, body": {
          fontSize: 14,
          fontFamily: "Carter One, sans-serif",
          overflowX: "hidden",
          height: "auto",
          background: linearGradient.theme
        },
        "*": {
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
        },
        ".ant-modal-mask": {
          backgroundColor: gray.normal3
        },
        a: {
          color: primary.deep
        }
      }}
    />
  );
};
