import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useERC20Contract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const approve = async (contract: Contract, address: string) => {
  const tx = await contract.approve(address, utils.parseEther("999999999").toString(), options);
  const receipt = await tx.wait();
  return receipt.status;
};

const useApprove = (approveTokenAddress: string, masterChefAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useERC20Contract(approveTokenAddress);
  const handleApprove = useCallback(async () => {
    if (account) await approve(contract, masterChefAddress);
  }, [account, dispatch, approveTokenAddress, contract]);

  return { onApprove: handleApprove };
};

export default useApprove;
