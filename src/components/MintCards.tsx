/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { errorToast, successToast } from "../services/toast-service";
import { gasLimit } from "../config";

const MintCards = ({ userNFT, LOTTERYContract }: any) => {
  const { address: account } = useAccount();
  const [isStake, setIsStake] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!account) {
      return;
    }
    initialSyncFunc();
  }, [setIsStake, account]);

  const initialSyncFunc = async () => {
    const isStake = await LOTTERYContract.readStake(userNFT.tokenId);
    setIsStake(isStake);
  };

  const handleStake = async () => {
    setIsProcessing(true);
    const contractFee = await LOTTERYContract.fee();
    LOTTERYContract.stake(userNFT.tokenId, {
      from: account,
      value: contractFee.toString(),
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then((item: any) => {
            successToast("Stake NFT successfully!");
            setIsStake(true);
            setIsProcessing(false);
          })
          .catch((err: any) => {
            successToast("transaction failed!");
          });
      })
      .catch((err: any) => {
        errorToast("Stake contract went wrong!");
        setIsProcessing(false);
      });
  };

  const handleUnstake = () => {
    setIsProcessing(true);
    LOTTERYContract.unstake(userNFT.tokenId, {
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        successToast("Unstake NFT successfully!");
        setIsStake(false);
        setIsProcessing(false);
      })
      .catch((err: any) => {
        setIsProcessing(false);
        successToast("Unstake NFT went wrong!");
      });
  };

  return (
    <div className="image-background max-w-sm rounded overflow-hidden shadow-lg min-h-[220px] border-[1px] rounded-xl w-[250px]">
      <div className="flex items-center justify-between mb-2 mt-2">
        <span className="inline-block bg-gray-800 px-3 py-1 mb-2 font-hairline text-white text-xs">
          # {userNFT?.tokenId}
        </span>
      </div>
      <img
        className="rounded-3xl p-2 mx-auto xl:mb-4 mb-5 w-[200px] h-[200px]"
        src={userNFT?.image}
        alt={userNFT?.image}
      />
      <div className="px-2 py-4">
        <button
          className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800 bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
          onClick={() => (!isStake ? handleStake() : handleUnstake())}
          disabled={isProcessing}
        >
          {isStake ? "Unstake NFT" : "Stake NFT"}
        </button>
      </div>
    </div>
  );
};

export default MintCards;
