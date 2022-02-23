import { ethers } from "ethers";
import { getMulticallBSCContract, getMulticallContract } from "hooks";
import { sample } from "lodash";
import MultiCallAbi from "config/abi/Multicall.json";

type MultiCallResponse<T> = T | null;
export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

interface MulticallOptions {
  requireSuccess?: boolean;
}

const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
  try {
    const multi = getMulticallContract();
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const multicallBSC = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
  try {
    const multi = getMulticallBSCContract();
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const multicallNetwork = async <T = any>(network: string, abi: any[], calls: Call[]): Promise<T> => {
  try {
    let multicallContract;
    if (network === "BSC") {
      const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
        sample([process.env.REACT_APP_BSC_NODE_1, process.env.REACT_APP_BSC_NODE_2, process.env.REACT_APP_BSC_NODE_3])
      );
      multicallContract = new ethers.Contract(
        "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
        MultiCallAbi,
        simpleRpcProvider
      );
    } else if (network === "AVAX") {
      const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
        sample([
          process.env.REACT_APP_AVAX_NODE_1,
          process.env.REACT_APP_AVAX_NODE_2,
          process.env.REACT_APP_AVAX_NODE_3
        ])
      );
      multicallContract = new ethers.Contract(
        "0x0b78ad358dDa2887285eaD72e84b47242360b872",
        MultiCallAbi,
        simpleRpcProvider
      );
    }
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
    const { returnData } = await multicallContract?.aggregate(calldata);
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return inclues a boolean whether the call was successful e.g. [wasSuccessfull, callResult]
 */
export const multicallv2 = async <T = any>(
  abi: any[],
  calls: Call[],
  options: MulticallOptions = { requireSuccess: true }
): Promise<MultiCallResponse<T>> => {
  const { requireSuccess } = options;
  const multi = getMulticallContract();
  const itf = new ethers.utils.Interface(abi);

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
  const returnData = await multi.tryAggregate(requireSuccess, calldata);
  const res = returnData.map((call: any, i: number) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res;
};

export default multicall;
