/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  getPrizeList,
  updateClaimPrize,
} from "../services/nft-prize-list-service";
import PrizeCards from "../components/PrizeCards";
import Loader from "react-spinners/HashLoader";
import { errorToast } from "../services/toast-service";

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader />
  </div>
);
const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 5,
  slidesToScroll: 5,
  arrows: true,
  initialSlide: 2,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 824,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 650,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
  ],
};

const SimpleCarousel = ({ LOTTERYContract, currentLotteryPrize }: any) => {
  const [allPrizes, setAllPrizes] = useState<any>([]);
  const [prizeListTable, setPrizeListTable] = useState<any>([]);
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState(false);
  const { address: account } = useAccount();

  useEffect(() => {
    prizeList();
  }, [setAllPrizes]);

  const prizeList = async () => {
    if (!currentLotteryPrize.lotteryId) {
      return;
    }
    setPageLoad(true);
    const prizes = currentLotteryPrize;
    const prizesList = [...prizes.prizeNFTs, ...prizes.prizeETHs];
    const updatedPrizeList = prizesList.map((updatedPrize) => {
      return {
        ...updatedPrize,
        lotteryId: prizes.lotteryId,
        isClaim: updatedPrize.isClaim || false,
      };
    });
    setAllPrizes(updatedPrizeList);
    setPrizeListTable(prizes);
    setPageLoad(false);
  };

  const claimedPrize = async (claimedPrize: any, index: number) => {
    const updatePrize = prizeListTable;
    if (!updatePrize) {
      return errorToast("LotteryID is not matching with your lotteryID!");
    }
    if (index < 9) {
      const updateClaimItems = await convertFunc(
        updatePrize,
        "prizeNFTs",
        index
      );
      const payload = {
        ...updatePrize,
        prizeNFTs: updateClaimItems,
      };
      await updateClaimPrize(payload);
    } else {
      const updateClaimItems = await convertFunc(
        updatePrize,
        "prizeETHs",
        index - 9
      );
      const payload = {
        ...updatePrize,
        prizeETHs: updateClaimItems,
      };
      await updateClaimPrize(payload);
    }
    prizeList();
  };

  const convertFunc = async (records: any, key: string, index: number) => {
    const updatedValue = records[key].map((prize: any, i: number) => {
      if (index === i) {
        return {
          ...prize,
          isClaim: true,
        };
      }
      return {
        ...prize,
      };
    });
    return updatedValue;
  };

  const handleClaimPrize = async () => {
    LOTTERYContract.claimPrize().then(() => {
      const prizes = currentLotteryPrize;
      const prizeETHs = prizes.prizeETHs.map((item: any) => {
        if (item.winnerWallet.toLowerCase() == account?.toLowerCase()) {
          return {
            ...item,
            isClaim: true,
          };
        }
        return {
          ...item,
        };
      });
      const prizeNFTs = prizes.prizeNFTs.map((item: any) => {
        if (item.winnerWallet.toLowerCase() == account?.toLowerCase()) {
          return {
            ...item,
            isClaim: true,
          };
        }
        return {
          ...item,
        };
      });
      const payload = {
        ...prizes,
        prizeETHs,
        prizeNFTs,
      };
      updateClaimPrize(payload);
    });
  };

  return (
    <>
      {pageLoad
        ? loader
        : allPrizes.length > 1 &&
          allPrizes.map((item: any, index: number) => (
            <PrizeCards
              key={index}
              prize={item}
              LOTTERYContract={LOTTERYContract}
              claimedPrize={claimedPrize}
              index={index}
            />
          ))}
      <div className="px-2 py-2 w-full m-auto mt-[2rem] flex justify-center">
        <button
          className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800  bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-[250px] cursor-pointer"
          onClick={() => handleClaimPrize()}
          // disabled={!isWinner}
        >
          Claim All
        </button>
      </div>
    </>
  );
};

export default SimpleCarousel;
