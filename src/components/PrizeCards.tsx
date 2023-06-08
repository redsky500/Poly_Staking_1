/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { treasureImage } from "../config";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { errorToast } from "../services/toast-service";
import { BigNumber } from "bignumber.js";

const nftImage =
  "https://ipfs.io/ipfs/QmPsTDD1BjwZ54DWEqRNpfTDpqKe4v5zoK6CZaA9h2BZEJ/";
const ethTreasureImage = treasureImage;

const PrizeCards = ({ prize, LOTTERYContract, claimedPrize, index }: any) => {
  const { address: account } = useAccount();
  const [isWinner, setIsWinner] = useState(false);
  const ethInWei = new BigNumber("10").exponentiatedBy(18);

  useEffect(() => {
    initialAsyncFunc();
  }, []);

  const initialAsyncFunc = async () => {
    const fetchWinner = await LOTTERYContract.prize();
    const isCurrentUserWinner =
      fetchWinner &&
      !prize.isClaim &&
      prize.winnerWallet?.toLocaleLowerCase() == account?.toLocaleLowerCase();
    setIsWinner(isCurrentUserWinner);
  };

  const handleClaimPrize = () => {
    if (prize.amount) {
      const ethValueOne: any = new BigNumber(`${prize.amount}`);
      const ethOneWei: any = ethValueOne.times(ethInWei);
      const ethOneTOWei = ethOneWei.toString();
      LOTTERYContract.claimEth({
        from: account,
        value: ethOneTOWei,
      })
        .then(() => claimedPrize(prize, index))
        .catch(() => errorToast("Claim prize went wrong!"));
    } else {
      LOTTERYContract.claimNFT(prize.tokenId)
        .then(() => claimedPrize(prize, index))
        .catch(() => errorToast("Claim prize went wrong!"));
    }
  };

  return (
    <div className="w-[250px] rounded overflow-hidden shadow-lg min-h-[220px] bg-gradient-to-tr from-themeColorRight to-themeColorLeft border-[1px] rounded-xl">
      <div className="flex justify-between">
        <div className="ellipse-para flex items-center justify-between mb-2 mt-2 bg-gray-800 font-hairline text-white text-xs py-1 px-1">
          <p className="ellipse-para">Winner: {prize.winnerWallet}</p>
        </div>
        <p className="flex items-center mb-2 mt-2 bg-gray-800 font-hairline text-white text-xs py-1 px-1">
          Prize: {prize.tokenId || prize.amount}
        </p>
      </div>
      <img
        className="rounded-3xl my-0 mx-auto mb-[10px] w-[200px] h-[200px] "
        src={
          prize?.amount
            ? ethTreasureImage
            : prize?.image || `${nftImage}${prize.tokenId}.png`
        }
        alt={prize?.image}
      />
      {isWinner && (
        <div className="px-2 py-2">
          <button
            className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
            onClick={() => handleClaimPrize()}
          >
            Claim
          </button>
        </div>
      )}
    </div>
  );
};

export default PrizeCards;
