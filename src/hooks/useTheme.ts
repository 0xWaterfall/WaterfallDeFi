import { useTheme as useEmotionTheme } from "@emotion/react";
import { ITheme } from "styles/theme";

export const useTheme = () => {
  const theme = useEmotionTheme();
  return theme as ITheme;
};
