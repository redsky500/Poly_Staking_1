const ethers = require("ethers");
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Network, Alchemy } from "alchemy-sdk";
import {
  setNFTCollection,
  getNFTCollection,
  updateNFT,
} from "../services/nft-collections-service";
import { LOTTERY_CONTRACTADDRESS, NFT_CONTRACTADDRESS } from "../config";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";
import MintCards from "./MintCards";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { errorToast, successToast } from "../services/toast-service";
import Loader from "react-spinners/HashLoader";

export interface NFTType {
  mint: string;
  staked: boolean;
  stakedTime: number;
}

export interface StoredNFT {
  tokenId: string;
  ownerAddress: string;
  contractAddress: string;
  level: number;
}

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader />
  </div>
);

const itemsPerPage = 50;
let currentPage = 1;

const Dashboard = () => {
  const [userNFTs, setMintCards] = useState<any[]>([]);
  const [userAllNFTs, setUserAllNFTs] = useState<any[]>([]);
  const [storedNFTs, setStoredNFTs] = useState<any[]>([]);
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const [isStakeAll, setIsStakeAll] = useState<boolean>(false);
  const [contractCost, setContractCost] = useState(0);
  const provider =
    typeof window !== "undefined" && window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;
  const Signer = provider?.getSigner();
  const { address: account } = useAccount();
  const LOTTERYContract = new ethers.Contract(
    LOTTERY_CONTRACTADDRESS,
    LOTTERYABI,
    Signer
  );
  const config = {
    apiKey: "A2lxdLrej8vanUUK4wAY3pniny2FEL5L",
    network: Network.ARB_MAINNET,
  };
  const alchemy = new Alchemy(config);

  useEffect(() => {
    if (!account) {
      return;
    }
    temp();
  }, [account]);

  const temp = async () => {
    setPageLoad(true);
    const storedNFTs = await getAllNFTs();
    const getNFTs = await filteredNFTs(account!);

    const nftDetailsForDB: any = [];
    const arbkeysCard: any = [];
    getNFTs.ownedNfts.map((item: any) => {
      console.log("NFT:" + `${item.contract.address}`);
      if (
        item.contract?.address.toLowerCase() ==
        NFT_CONTRACTADDRESS.toLowerCase()
      ) {
        const image = item?.rawMetadata?.image?.includes("ipfs://")
          ? item?.rawMetadata?.image?.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )
          : item?.rawMetadata?.image;
        arbkeysCard.push({
          ...item,
          image,
        });
        const isTokenSaved = storedNFTs.find(
          (nft: any) => nft.tokenId === item.tokenId
        );
        if (!isTokenSaved?.isStakeDisabled) {
          setIsStakeAll(true);
        }
        if (!isTokenSaved) {
          nftDetailsForDB.push({
            tokenId: item.tokenId,
            ownerAddress: account,
            level: 1,
            image,
            isStakeDisabled: false,
          });
        }
      }
    });
    if (nftDetailsForDB.length) {
      await setNFTCollection(nftDetailsForDB);
      await getAllNFTs();
    }
    setUserAllNFTs(arbkeysCard);
    updatePagination(arbkeysCard);
    setPageLoad(false);
    LOTTERYContract.cost().then((res: any) => {
      setContractCost(res.toString());
    });
  };

  const getAllNFTs = async () => {
    const response = await getNFTCollection();
    setStoredNFTs(response);
    return response;
  };

  const filteredNFTs = useCallback(async (account: string) => {
    const items = await alchemy.nft.getNftsForOwner(account);
    return items;
  }, []);

  const paginate = (items: any, itemsPerPage: number, currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    return paginatedItems;
  };

  const updatePagination = (items: any) => {
    const paginatedItems = paginate(items, itemsPerPage, currentPage);
    setMintCards(paginatedItems);
  };

  const handleNFTPagination = () => {
    const totalPages = Math.ceil(userAllNFTs.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination(userAllNFTs);
    } else {
      errorToast(`You have total ${userAllNFTs.length} NFTs`);
    }
  };

  const handleAllStake = () => {
    setIsStakeAll(true);
    const tokenIds: string[] = [];
    userNFTs.map((userNft: any) => {
      const storedNft = storedNFTs.find(
        (storedNft: any) =>
          !storedNft.isStakeDisabled && userNft.tokenId == storedNft.tokenId
      );
      if (storedNft) {
        tokenIds.push(storedNft.tokenId);
      }
    });
    const levels: number[] = [];
    userNFTs.map((userNft: any) => {
      const storedNft = storedNFTs.find(
        (storedNft: any) =>
          !storedNft.isStakeDisabled && userNft.tokenId == storedNft.tokenId
      );
      if (storedNft) {
        levels.push(storedNft.level);
      }
    });
    const totalCost = tokenIds.length * contractCost;

    LOTTERYContract.stakeAll(tokenIds, levels, {
      from: account,
      value: totalCost,
    })
      .then(() => {
        updateStakeAllNFTs();
      })
      .catch((err: any) => {
        errorToast(err.message);
        setIsStakeAll(true);
      });
  };

  const updateStakeAllNFTs = async () => {
    setPageLoad(true);
    userNFTs.map(async (userNft: any) => {
      const storedNft = storedNFTs.find(
        (storedNft: any) => storedNft.tokenId === userNft.tokenId
      );
      if (storedNft) {
        await updateNFT({
          ...storedNft,
          isStakeDisabled: true,
        });
      }
    });
    successToast("Updated all the NFTs!");
    await getAllNFTs();
    setPageLoad(false);
  };

  return (
    <>
      {pageLoad ? (
        loader
      ) : (
        <div className="w-full px-4 sm:px-16 py-8 font-inter text-center text-[20px]">
          {userNFTs.length > 0 && (
            <div className="px-2 py-4 w-[250px] m-auto">
              <button
                className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800 bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
                onClick={() => handleAllStake()}
                disabled={!isStakeAll}
              >
                Stake All
              </button>
            </div>
          )}
          <div className="max-w-[1440px] xl:flex flex-col p-10 m-auto mt-0 min-h-[]">
            <div className="flex flex-wrap justify-center items-center xl:w-full gap-[20px] px-[16px]">
              {!userNFTs.length && (
                <span className="text-white">
                  There is not any NFTs in your Account
                </span>
              )}
              {userNFTs.map((mint: any) => (
                <MintCards
                  key={mint.tokenId}
                  userNFT={mint}
                  storedNFTs={storedNFTs}
                  isLotteryPage={false}
                  LOTTERYContract={LOTTERYContract}
                  contractCost={contractCost}
                />
              ))}
            </div>
            <div>
              {userNFTs.length > 0 && (
                <div className="px-2 py-4 w-[250px] m-auto">
                  <button
                    className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800 bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
                    onClick={() => handleNFTPagination()}
                  >
                    More
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-[1rem] text-white text-center mt-8">
            View your Arbkeys on&nbsp;
            <a
              href="https://opensea.io/collection/arbkeys"
              rel="referrer noreferrer"
              className="text-indigo-400 hover:text-blue-700 duration-300 transition-all decoration-0"
              target="_blank"
            >
              Opensea
            </a>
          </p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
