import { useAppSelector } from "store";

export default () => useAppSelector((state) => state.showStatus.cookieModal);
