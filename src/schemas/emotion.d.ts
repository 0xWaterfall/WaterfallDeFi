import "@emotion/react";
import { ITheme } from "styles/theme";

/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "@emotion/react" {
  export interface Theme extends ITheme {}
}
