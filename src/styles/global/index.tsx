import { Global, useTheme } from "@emotion/react";

export default () => {
  const { gray, primary, white, dark, useColorModeValue } = useTheme();
  return (
    <Global
      styles={{
        "html, body": {
          fontSize: 14,
          fontFamily: "IBM Plex Sans, Roboto, Helvetica, Arial, sans-serif",
          overflowX: "hidden",
          height: "auto",
          background: useColorModeValue(white.normal, dark.basic)
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
          color: primary.deep,
          ":hover": {
            color: primary.deep
          }
        },
        ".ant-tooltip-inner > p": {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        },
        ".timeline-Widget": {
          background: "none !important"
        }
      }}
    />
  );
};
