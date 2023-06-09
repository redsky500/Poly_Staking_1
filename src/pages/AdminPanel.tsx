import type { NextPage } from "next";
import { useState } from "react";
import { gasLimit } from "../config";
import {
  errorToast,
  successToast,
  defaultToast,
} from "../services/toast-service";
const BigNumber = require("bignumber.js");

const AdminPanel: NextPage = ({ LOTTERYContract }: any) => {
  const [fees, setFees] = useState(0);
  const [prize, setPrize] = useState(0);
  const [isFeeProcess, setIsFeeProcess] = useState(false);
  const [isRewardProcess, setIsRewardProcess] = useState(false);
  const ethInWei = new BigNumber("10").exponentiatedBy(18);

  const handleFees = () => {
    if (!fees) {
      return defaultToast("Please set Fees");
    }
    setIsFeeProcess(true);
    const feesValue: any = new BigNumber(`${fees}`);
    const feesWei: any = feesValue.times(ethInWei);
    const feesWeiToWei = feesWei.toString();

    LOTTERYContract.setFee(feesWeiToWei, {
      gasLimit,
      nonce: undefined,
    }).then((res: any) => {
      res
        .wait()
        .then(() => {
          successToast("The transaction is completed");
        })
        .catch((err: any) => errorToast("set fee went wrong!"));
      setIsFeeProcess(false);
    });
  };

  const handlePrize = () => {
    if (!prize) {
      return defaultToast("Please set Fees");
    }
    setIsRewardProcess(true);
    // Prize Converter
    const prizeValue: any = new BigNumber(`${prize}`);
    const prizeWei: any = prizeValue.times(ethInWei);
    const prizeWeiToWei = prizeWei.toString();
    LOTTERYContract.setReward(prizeWeiToWei).then((res: any) => {
      res
        .wait()
        .then(() => {
          successToast("The transaction is completed");
        })
        .catch((err: any) => errorToast("set reward went wrong!"));
      setIsRewardProcess(false);
    });
  };

  return (
    <>
      <div className="text-white text-center max-w-[600px] my-[20px] mx-auto box-content p-4 border-4 border-teal-400 bg-[#0000005c] rounded-[15px]">
        <p className="mt-[5px] mb-[15px] text-5xl font-medium leading-tight text-white font-Rubik glowing-text-white">
          Set Reward and Fee
        </p>
        <div className="wrapper w-[500]">
          <div className="mt-[30px]">
            <p className="m-0 text-white font-Rubik">Set Fee</p>
          </div>
          <div className="grid gap-[10px] mb-[20px] items-center grid-cols-1">
            <input
              type="text"
              id="fees"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Set Fee"
              onChange={(e: any) => setFees(e.target.value)}
              required
            ></input>
          </div>
          <button
            className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full"
            onClick={() => handleFees()}
            disabled={isFeeProcess}
          >
            Set Fee
          </button>
        </div>

        <div className="wrapper w-[500] mt-[50px]">
          <div>
            <p className="m-0 text-white font-Rubik">Set Reward</p>
          </div>
          <div className="grid gap-[10px] items-center grid-cols-1">
            <input
              type="text"
              id="prize"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Set Reward"
              onChange={(e: any) => setPrize(e.target.value)}
              required
            ></input>
          </div>
          <button
            className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full mt-[20px]"
            onClick={() => handlePrize()}
            disabled={isRewardProcess}
          >
            Set Reward
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
