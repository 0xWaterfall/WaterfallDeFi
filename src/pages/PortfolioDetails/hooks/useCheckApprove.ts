import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useERC20Contract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const checkApprove = async (contract: Contract, trancheMasterAddress: string, account: string) => {
  const tx = await contract.allowance(account, trancheMasterAddress);
  if (tx?._hex) return new BigNumber(tx?._hex).isZero() ? false : true;
};

const useCheckApprove = (approveTokenAddress: string, trancheMasterAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useERC20Contract(approveTokenAddress);
  const handleCheckApprove = useCallback(async () => {
    if (account) return await checkApprove(contract, trancheMasterAddress, account);
    return false;
  }, [account, dispatch, contract, approveTokenAddress]);

  return { onCheckApprove: handleCheckApprove };
};

export default useCheckApprove;
