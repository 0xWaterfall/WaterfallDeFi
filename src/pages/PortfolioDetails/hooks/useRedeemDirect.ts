import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useMasterchefContract, useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
import { DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { Contract } from "@ethersproject/contracts";
import { getPosition, getTrancheBalance } from "store/position";
import { useSelectedMarket } from "hooks/useSelectors";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT
};

const redeem = async (contract: Contract, i: number) => {
  const tx = await contract.redeemDirect(i);
  const receipt = await tx.wait();
  return receipt.status;
};

const useRedeemDirect = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useTrancheMasterContract();
  const market = useSelectedMarket();
  const handleRedeemDirect = useCallback(
    async (i: number) => {
      await redeem(contract, i);
      account && dispatch(getTrancheBalance({ account }));
      market && account && dispatch(getPosition({ market, account }));
      //   dispatch(updateUserStakedBalance(sousId, account));
    },
    [account, dispatch, contract]
  );

  return { onRedeemDirect: handleRedeemDirect };
};

export default useRedeemDirect;
