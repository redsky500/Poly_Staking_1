/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { updateNFT } from "../services/nft-collections-service";
import { treasureImage } from "../config";
import {
  errorToast,
  successToast,
  defaultToast,
} from "../services/toast-service";
import { useAccount } from "wagmi";

const nftImage =
  "https://ipfs.io/ipfs/QmPsTDD1BjwZ54DWEqRNpfTDpqKe4v5zoK6CZaA9h2BZEJ/";
const ethTreasureImage = treasureImage;

const MintCards = ({
  userNFT,
  storedNFTs,
  isLotteryPage,
  LOTTERYContract,
  contractCost,
}: any) => {
  const [stakeNFT, setStakeNFt] = useState<any>({});
  const [allNFTs, setAllNFTs] = useState<any>([]);
  const [isLotteryStarted, setIsLotteryStarted] = useState(false);
  const { address: account } = useAccount();

  useEffect(() => {
    if (!isLotteryPage) {
      LOTTERYContract.lotteryEndTime()
        .then((item: any) => {
          const utcDate = new Date(item * 1000);
          const targetDate = new Date(
            utcDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
          );
          const currentDate = new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            })
          );
          setIsLotteryStarted(targetDate > currentDate);
        })
        .catch((err: unknown) => errorToast(`lottery end time went wrong!`));
    }
    const filterNFT = storedNFTs?.find(
      (item: any) => item.tokenId === userNFT.tokenId
    );
    setStakeNFt(filterNFT);
    setAllNFTs(storedNFTs);
  }, [setStakeNFt, storedNFTs]);

  const updateLevel = (stakeNFt: any) => {
    updateNFT(stakeNFt).then(() => {
      setStakeNFt(stakeNFt);
      successToast("Welcome to the lottery! NFT updated.");
    });
  };

  const handleStake = () => {
    if (!isLotteryStarted) {
      return defaultToast("The Lottery is not started yet.");
    }
    let stakeNFt = allNFTs.find(
      (item: any) => item.tokenId === userNFT.tokenId
    );
    LOTTERYContract.enterLottery(stakeNFt.tokenId, stakeNFt.level, {
      from: account,
      value: contractCost,
    })
      .then(() => {
        stakeNFt = {
          ...stakeNFt,
          isStakeDisabled: true,
        };
        updateLevel(stakeNFt);
        setStakeNFt(stakeNFt);
      })
      .catch((err: any) => {
        errorToast(`enter lottery went wrong!`);
      });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg min-h-[220px] bg-gradient-to-tr from-themeColorRight to-themeColorLeft border-[1px] rounded-xl w-[250px]">
      <div className="flex items-center justify-between mb-2 mt-2">
        {!isLotteryPage ? (
          <>
            <span className="inline-block bg-gray-800 px-3 py-1 mr-2 mb-2 font-hairline text-white text-xs">
              Level {stakeNFT?.level || 1}
            </span>
            <a
              href="https://opensea.io/collection/arbkeys"
              rel="referrer noreferrer"
              className="inline-block bg-gray-800 px-3 py-1 mr-2 mb-2 font-hairline text-white text-xs cursor-pointer"
              target="_blank"
            >
              Opensea
            </a>
            <span className="inline-block bg-gray-800 px-3 py-1 mb-2 font-hairline text-white text-xs">
              # {userNFT?.tokenId}
            </span>
          </>
        ) : (
          <span className="inline-block bg-gray-800 px-3 py-1 mr-2 mb-2 font-hairline text-white text-xs">
            {!userNFT.amount
              ? userNFT.tokenId + " NFT"
              : userNFT.amount + " ETH"}
          </span>
        )}
      </div>
      <img
        className="rounded-3xl p-2 mx-auto xl:mb-4 mb-5 w-[200px] h-[200px]"
        src={
          userNFT?.amount
            ? ethTreasureImage
            : userNFT?.image || `${nftImage}${userNFT.tokenId}.png`
        }
        alt={userNFT?.image}
      />
      {!isLotteryPage && (
        <div className="px-2 py-4">
          <button
            className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800 bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
            onClick={() => handleStake()}
            disabled={stakeNFT?.isStakeDisabled}
          >
            Stake NFT
          </button>
        </div>
      )}
    </div>
  );
};

export default MintCards;
