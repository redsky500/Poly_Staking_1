import type { NextPage } from "next";
import { useState, useEffect } from "react";
import {
  storPrize,
  getPrizeList,
  updatePrize,
} from "../services/nft-prize-list-service";
import {
  updateAllNFT,
  updateLevelAfterLotteryEnd,
  getNFTCollection,
} from "../services/nft-collections-service";
import { storParticipants } from "../services/participants.-service";
import { gasLimit } from "../config";
import {
  errorToast,
  successToast,
  defaultToast,
} from "../services/toast-service";

const BigNumber = require("bignumber.js");

export interface NFTType {
  mint: string;
  staked: boolean;
  stakedTime: number;
}
const approveAccount = "0x1637482b90A5b7c1F227A069873B94208d0696B7";

const AdminPanel: NextPage = ({ NFTMintContract, LOTTERYContract }: any) => {
  const [isLotteryStarted, setIsLotteryStarted] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [days, setDays] = useState(0);
  const [hour, setHour] = useState(0);
  const [firstNFT, setFirstNFT] = useState(0);
  const [secondNFT, setSecondNFT] = useState(0);
  const [thirdNFT, setThirdNFT] = useState(0);
  const [fourthNFT, setFourthNFT] = useState(0);
  const [fifthNFT, setFifthNFT] = useState(0);
  const [sixthNFT, setSixthNFT] = useState(0);
  const [seventhNFT, setSeventhNFT] = useState(0);
  const [eighthNFT, setEighthNFT] = useState(0);
  const [ninthNFT, setNinthNFT] = useState(0);
  const [firstETH, setFirstETH] = useState(0);
  const [prizeList, setPrizeList] = useState<any>([]);
  const ethInWei = new BigNumber("10").exponentiatedBy(18);

  useEffect(() => {
    LOTTERYContract.lotteryEndTime()
      .then((item: any) => {
        const targetDate = new Date(item * 1000);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const day = targetDate.getDate();
        const hour = Math.floor(
          (targetDate.getTime() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        setYear(year);
        setMonth(month);
        setDays(day);
        setHour(hour);
      })
      .catch((err: unknown) => errorToast("Lottery End Time went wrong!"));
    getPrizeList().then((prize) => {
      const inCompletedPrize = prize.filter((item: any) => !item.isCompleted);
      const isEndButton: boolean = inCompletedPrize.length > 0 ? true : false;
      setPrizeList(inCompletedPrize);
      setIsLotteryStarted(isEndButton);
      const completedPrize = prize.filter((item: any) => item.isCompleted);
      const x = completedPrize[completedPrize.length - 1];
      if (x && !x?.ownerList?.length) {
        handlePrizeOwnerList(x);
      }
    });
  }, []);

  const validation = () => {
    if (!year) return "Please insert a Year!";
    if (!month) return "Please insert a Month!";
    if (!days) return "Please insert a Day!";
    if (!firstNFT) return "Please insert a NFT prize 1!";
    if (!secondNFT) return "Please insert a NFT prize 2!";
    if (!thirdNFT) return "Please insert a NFT prize 3!";
    if (!fourthNFT) return "Please insert a NFT prize 4!";
    if (!fifthNFT) return "Please insert a NFT prize 5!";
    if (!sixthNFT) return "Please insert a NFT prize 6!";
    if (!seventhNFT) return "Please insert a NFT prize 7!";
    if (!eighthNFT) return "Please insert a NFT prize 8!";
    if (!ninthNFT) return "Please insert a NFT prize 9!";
    if (!firstETH) return "Please insert a ETH prize 1!";
  };

  const handleStorePrize = (payload: any) => {
    storPrize(payload).catch((err) => {
      errorToast("Prize is not stored in the database!");
    });
  };

  const handleStakeButton = (payload: any) => {
    updateAllNFT(payload).catch((err) => {
      errorToast("Update NFTs went wrong!");
    });
  };

  const startLottery = () => {
    const validator = validation();
    if (validator) {
      return defaultToast(validator);
    }
    const selectedTimeString = `${year}-${month
      .toString()
      .padStart(2, "0")}-${days.toString().padStart(2, "0")}T${hour
      .toString()
      .padStart(2, "0")}:00:00`;
    let localDate = new Date(selectedTimeString);
    let localOffset = localDate.getTimezoneOffset();
    let pstOffset = 420;
    let targetDate = new Date(
      localDate.getTime() - (localOffset - pstOffset) * 60000
    );
    const PSTTime = new Date(targetDate).toISOString();
    const utcTimestamp = new Date(PSTTime).getTime() / 1000;

    // ethereum one
    const ethValueOne: any = new BigNumber(`${firstETH}`);
    const ethOneWei: any = ethValueOne.times(ethInWei);
    const ethOneTOWei = ethOneWei.toString();

    const payload = {
      utcTimestamp: utcTimestamp,
      isCompleted: false,
      prizeNFTs: [
        {
          tokenId: firstNFT,
        },
        {
          tokenId: secondNFT,
        },
        {
          tokenId: thirdNFT,
        },
        {
          tokenId: fourthNFT,
        },
        {
          tokenId: fifthNFT,
        },
        {
          tokenId: sixthNFT,
        },
        {
          tokenId: seventhNFT,
        },
        {
          tokenId: eighthNFT,
        },
        {
          tokenId: ninthNFT,
        },
      ],
      prizeETHs: [
        {
          amount: firstETH,
        },
      ],
    };

    const allNFT = [
      firstNFT,
      secondNFT,
      thirdNFT,
      fourthNFT,
      fifthNFT,
      sixthNFT,
      seventhNFT,
      eighthNFT,
      ninthNFT,
    ];
    let approve_result = true;

    allNFT.map(async (item: any) => {
      const approved = await NFTMintContract.getApproved(item);
      console.log(approved);
      if (approved.toLowerCase() == approveAccount.toLowerCase()) {
        approve_result = approve_result && true;
        return;
      }
      const approve_tx = await NFTMintContract.approve(approveAccount, item, {
        gasLimit,
        nonce: undefined,
      });
      console.log(approve_result);
      if (approve_tx) {
        approve_result = approve_result && true;
      } else {
        approve_result = approve_result && false;
      }
    });
    if (approve_result) {
      LOTTERYContract.startLottery(utcTimestamp, allNFT, ethOneTOWei, {
        gasLimit,
        nonce: undefined,
      })
        .then((lotteryResponse: any) => {
          lotteryResponse
            .wait()
            .then(() => {
              successToast("Started a new Lottery!");
              handleStorePrize(payload);
              handleStakeButton({ isStakeDisabled: false });
              setIsLotteryStarted(true);
            })
            .catch((err: any) => {
              errorToast("Transaction is went wrong");
            });
        })
        .catch((err: any) => {
          errorToast("Start Lottery went wrong!");
        });
    }
  };

  const handleEndLottery = () => {
    if (!prizeList.length) {
      return errorToast("Something Went wrong! Please reload the page.");
    }
    LOTTERYContract.endLottery()
      .then(() => {
        setTimeout(() => {
          handlePrizeOwnerList();
        }, 1000);
      })
      .catch(() => errorToast("End Lottery went wrong"));
  };

  const handlePrizeOwnerList = async (prizeListEmpty?: any) => {
    LOTTERYContract.prizeOwner()
      .then(async (res: any) => {
        const prizeListManage = prizeList.length ? prizeList : [prizeListEmpty];

        const prizeHistory = {
          lotteryId: res[0],
          lotteryOwners: res[1],
        };
        const updatedNFTPrizeList = prizeListManage[0].prizeNFTs.map(
          (item: any, index: number) => {
            return {
              ...item,
              winnerWallet: prizeHistory.lotteryOwners[index],
            };
          }
        );
        const updatedEthPrizeList = prizeListManage[0].prizeETHs.map(
          (item: any, index: number) => {
            return {
              ...item,
              winnerWallet: prizeHistory.lotteryOwners[index + 9],
            };
          }
        );
        const payload = {
          ...prizeListManage[0],
          prizeNFTs: updatedNFTPrizeList,
          prizeETHs: updatedEthPrizeList,
          isCompleted: true,
          lotteryId: res[0].toString(),
          ownerList: res[1],
        };
        handleEndLotteryDB(payload);
      })
      .catch(() => errorToast("Prize Owner is not updated"));
  };

  const handleEndLotteryDB = async (payload: any) => {
    const allNFTs = await getNFTCollection();
    const participants: any = [];
    await allNFTs.map(async (item: any) => {
      if (item.isStakeDisabled) {
        participants.push(item.tokenId)
      }
    });
    await storParticipants({lotteryId: payload.lotteryId, participants});
    await updateLevelAfterLotteryEnd();
    updatePrize(payload).catch((err) => console.log(err));
  };

  return (
    <>
      <div className="text-white shadow-[2px 6px 9px 2px rgb(0 0 0 / 20%)] text-center max-w-[600px] my-[20px] mx-auto bg-countdownBG text-countdownColor rounded-xl p-[4rem] my-[30px] font-sans">
        <p className="mt-[5px] mb-[15px]">Lottery End Time</p>
        <div className="wrapper">
          <div className="grid gap-[10px] grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
            <p className="m-0">Year</p>
            <p className="m-0">Month</p>
            <p className="m-0">Date</p>
            <p className="m-0">Hours</p>
          </div>
          <div className="grid gap-[10px] grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
            <input
              type="number"
              id="year"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Year"
              value={year}
              onChange={(e: any) => setYear(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="number"
              id="month"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Month"
              value={month}
              onChange={(e: any) => setMonth(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="number"
              id="day"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Day"
              value={days}
              onChange={(e: any) => setDays(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="number"
              id="hour"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Hour"
              value={hour}
              onChange={(e: any) => setHour(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
          </div>
        </div>
        <div className="wrapper w-[500]">
          <div className="mt-[30px]">
            <p className="m-0 text-white">NFT PRIZE</p>
          </div>
          <div className="grid gap-[10px] my-[30px] items-center grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
            <input
              type="text"
              id="NFTPRIZE1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setFirstNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setSecondNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE3"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setThirdNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE4"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setFourthNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE5"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setFifthNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE6"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setSixthNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE7"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setSeventhNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE8"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setEighthNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
            <input
              type="text"
              id="NFTPRIZE9"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="NFT tokenID"
              onChange={(e: any) => setNinthNFT(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
          </div>
          <div className="mt-[30px]">
            <p className="m-0 text-white">ETH PRIZE</p>
          </div>
          <div className="grid gap-[10px] items-center grid-cols-[repeat(4, calc(25% - 8px))] grid-cols-4">
            <input
              type="text"
              id="ETHPRIZE1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ETH prize"
              onChange={(e: any) => setFirstETH(e.target.value)}
              required
              disabled={isLotteryStarted}
            ></input>
          </div>
        </div>
        {isLotteryStarted ? (
          <button
            className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full mt-[40px]"
            onClick={() => handleEndLottery()}
          >
            End Lottery
          </button>
        ) : (
          <button
            className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full mt-[40px]"
            onClick={() => startLottery()}
          >
            Start Lottery
          </button>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
