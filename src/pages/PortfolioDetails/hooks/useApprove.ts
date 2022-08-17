import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useERC20Contract } from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { Dispatch } from "redux";
import { setConfirmModal } from "store/showStatus";
// const options = {
//   gasLimit: DEFAULT_GAS_LIMIT
// };

const approve = async (contract: Contract, address: string, dispatch: Dispatch<any>) => {
  const tx = await contract.approve(
    address,
    //USDC || USDC.e
    address === "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" || address === "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
      ? utils.parseUnits("999999999", 6)
      : utils.parseEther("999999999").toString()
  );
  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Approve Submitted"
    })
  );
  // return tx.hash;
  const receipt = await tx.wait();

  if (receipt.status) {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "COMPLETED",
        pendingMessage: "Approve Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Approve Failed"
      })
    );
  }
  return receipt.status;
};

const useApprove = (approveTokenAddress: string, masterChefAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useERC20Contract(approveTokenAddress);
  const handleApprove = useCallback(async () => {
    if (account) await approve(contract, masterChefAddress, dispatch);
  }, [account, dispatch, approveTokenAddress, contract]);

  return { onApprove: handleApprove };
};

export const useMultiApprove = (approveTokenAddresses: string[], masterChefAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contracts = approveTokenAddresses.map((a, i) => useERC20Contract(a));
  const handleMultiApprove = useCallback(async () => {
    if (account) {
      for (let i = 0; i < contracts.length; i++) {
        await approve(contracts[i], masterChefAddress, dispatch);
      }
    }
  }, [account, dispatch, approveTokenAddresses, contracts]);

  return { onMultiApprove: handleMultiApprove };
};

export default useApprove;
