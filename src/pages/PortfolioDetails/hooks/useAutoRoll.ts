import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAutorollingTrancheMasterContract } from "hooks/useContract";
import { Contract } from "@ethersproject/contracts";

const getAutoRoll = async (contract: Contract, account: string | null | undefined) => {
  const autoRoll = await contract.userInfo(account);
  return autoRoll.isAuto;
};

const autoRoll = async (contract: Contract, autoState: boolean) => {
  const tx = await contract.switchAuto(autoState);
  const receipt = await tx.wait();
  return receipt.status;
};

const useAutoRoll = (trancheMasterAddress: string) => {
  const { account } = useWeb3React();
  const contract = useAutorollingTrancheMasterContract(trancheMasterAddress);

  const handleGetAutoRoll = useCallback(async () => {
    const result = await getAutoRoll(contract, account);
    return result;
  }, [account, contract]);

  const handleChangeAutoRoll = useCallback(
    async (autoState: boolean) => {
      const result = await autoRoll(contract, autoState);
      return result;
    },
    [account, contract]
  );

  return { getAutoRoll: handleGetAutoRoll, changeAutoRoll: handleChangeAutoRoll };
};

export default useAutoRoll;
