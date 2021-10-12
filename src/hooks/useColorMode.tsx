import { useAppSelector } from "store";

export const colorMode = () => {
  const theme = useAppSelector((state) => state.selectedKeys.theme);
  return theme;
};

export const useColorModeValue = (light?: string, dark?: string) => {
  const theme = useAppSelector((state) => state.selectedKeys.theme);
  if (theme === "light" && light) return light;
  if (theme === "dark" && dark) return dark;
  return light;
};
