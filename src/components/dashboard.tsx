import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import MintCards from "./MintCards";
import { errorToast } from "../services/toast-service";
import Loader from "react-spinners/HashLoader";

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader />
  </div>
);
const itemsPerPage = 50;
let currentPage = 1;

const Dashboard = ({ alchemy, LOTTERYContract }: any) => {
  const { address: account } = useAccount();
  const [userNFTs, setUserNFTs] = useState([]);
  const [pageLoad, setPageLoad] = useState(false);
  const [paginationNFT, setMintCards] = useState([]);

  useEffect(() => {
    if (!account) {
      return;
    }
    initialSyncFunction();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const initialSyncFunction = async () => {
    setPageLoad(true);
    const getNFTs = await filteredNFTs(account!);
    const convertedAllNFTs = getNFTs.ownedNfts.map((item: any) => {
      const image = item?.rawMetadata?.image?.includes("ipfs://")
        ? item?.rawMetadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")
        : item?.rawMetadata?.image;
      return {
        tokenId: item.tokenId,
        image,
      };
    });
    setUserNFTs(convertedAllNFTs);
    setPageLoad(false);
    updatePagination(convertedAllNFTs);
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
    const totalPages = Math.ceil(userNFTs.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination(userNFTs);
    } else {
      errorToast(`You have total ${userNFTs.length} NFTs`);
    }
  };

  return (
    <>
      {pageLoad ? (
        loader
      ) : (
        <div className="w-full px-4 sm:px-16 py-8 font-inter text-center text-[20px]">
          <div className="max-w-[1440px] xl:flex flex-col p-10 m-auto mt-0 min-h-[]">
            <div className="flex flex-wrap justify-center items-center xl:w-full gap-[20px] px-[16px]">
              {!userNFTs.length && (
                <span className="text-white">
                  There is not any NFTs in your Account
                </span>
              )}
              {paginationNFT.map((mint: any) => (
                <MintCards
                  key={mint.tokenId}
                  userNFT={mint}
                  LOTTERYContract={LOTTERYContract}
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
        </div>
      )}
    </>
  );
};

export default Dashboard;
