import { useEffect } from "react";
import { ConnectorNames } from "schemas/enum";
import useAuth from "utils/useAuth";

const useEagerConnect = (network: string) => {
  const { login } = useAuth(network);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorIdv2") as ConnectorNames;
    if (connectorId) {
      login(connectorId);
    }
  }, [login]);
};

export default useEagerConnect;
