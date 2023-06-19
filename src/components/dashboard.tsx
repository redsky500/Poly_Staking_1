import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import MintCards from "./MintCards";
import { errorToast } from "../services/toast-service";
import Loader from "react-spinners/HashLoader";
import Tab from "./tab";
import CustomButton from "./CustomButton";
import { gasLimit } from "../config";

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader color={"white"} />
  </div>
);
const itemsPerPage = 50;
let currentPage = 1;
const filterContract = "0xDa9e84CA5b437a88Ab2a5895720c929d32F44b67";

const Dashboard = ({ alchemy, LOTTERYContract }: any) => {
  const { address: account } = useAccount();
  const [userNFTs, setUserNFTs] = useState([]);
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isButtonProcessing, setIsButtonProcessing] = useState(false);
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
    const matchedNFTs = getNFTs.ownedNfts.filter(
      (item: any) =>
        item.contract?.address?.toLowerCase() == filterContract.toLowerCase()
    );
    const convertedAllNFTs: any = [];
    matchedNFTs.map((item: any, index: number) => {
      const image = item?.rawMetadata?.image?.includes("ipfs://")
        ? item?.rawMetadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")
        : item?.rawMetadata?.image;
      LOTTERYContract.readStake(item.tokenId).then((isStaked: boolean) => {
        convertedAllNFTs.push({
          tokenId: item.tokenId,
          image,
          isStaked,
        });
        if (matchedNFTs.length - 1 == index) {
          setUserNFTs(convertedAllNFTs);
          handleTabs("tab-1", convertedAllNFTs);
        }
      });
    });
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

  const handleTabs = (CurrentTab: string, allNFTs: any = []) => {
    const userAllNFTs = allNFTs?.length ? allNFTs : userNFTs;
    const handledNFTs = userAllNFTs.filter((item: any) => {
      return CurrentTab == "tab-1" ? !item.isStaked : item.isStaked;
    });
    updatePagination(handledNFTs);
    setPageLoad(false);
    setIsLoggedIn(true);
  };

  const handleStakeAll = async () => {
    setIsButtonProcessing(true);
    const allStakeNFT = userNFTs
      .filter((item: any) => !item.isStaked)
      .map((item: any) => item.tokenId);

    const contractFee = await LOTTERYContract.fee();
    const amount = allStakeNFT.length * contractFee.toString();

    LOTTERYContract.stake(allStakeNFT, {
      from: account,
      value: amount,
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then(() => {
            initialSyncFunction();
            setIsButtonProcessing(false);
          })
          .catch(() => {
            errorToast("transaction failed!");
            setIsButtonProcessing(false);
          });
      })
      .catch(() => {
        errorToast("Stake contract went wrong!");
        setIsButtonProcessing(false);
      });
  };

  const handleUnstakeAll = () => {
    setIsButtonProcessing(true);
    const allStakeNFT = userNFTs
      .filter((item: any) => item.isStaked)
      .map((item: any) => item.tokenId);

    LOTTERYContract.unstake(allStakeNFT, {
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then(() => {
            initialSyncFunction();
            setIsButtonProcessing(false);
          })
          .catch(() => {
            setIsButtonProcessing(false);
          });
      })
      .catch(() => {
        setIsButtonProcessing(false);
      });
  };

  return (
    <>
      {pageLoad ? (
        loader
      ) : (
        <div className="w-full h-full overflow-auto px-4 sm:px-16 py-8 font-inter text-center text-[20px]">
          <div className="max-w-[1440px] xl:flex flex-col p-10 m-auto mt-0 min-h-full">
            <div className="flex flex-wrap justify-center items-center xl:w-full gap-[20px] px-[16px]">
              {!isLoggedIn && (
                <div className="dashboard-content-wrapper">
                  <div className="meta-wolf-wrapper">
                    <span>Metaland</span>
                    <br />
                    <span>Wolfpack</span>
                  </div>
                  <div className="mt-5">
                    <p className="wolf-para">
                      Welcome to Metaland Wolfpacks staking platform powered by
                      Juice Vendor Labs. Connect your wallet and stake your MWP
                      NFTs for $WOLF. $WOLF can be used for various ecosystem
                      benefits!
                    </p>
                  </div>
                </div>
              )}
              {isLoggedIn && (
                <Tab
                  NFTCards={paginationNFT.map((mint: any) => (
                    <MintCards
                      key={mint.tokenId}
                      userNFT={mint}
                      LOTTERYContract={LOTTERYContract}
                      initialSyncFunction={initialSyncFunction}
                    />
                  ))}
                  moreButton={
                    userNFTs.length > 0 && (
                      <CustomButton
                        handleClickEvent={handleNFTPagination}
                        isProcessing={isButtonProcessing}
                        text={"More"}
                      />
                    )
                  }
                  handleTabs={handleTabs}
                  handleStakeAll={
                    <div className="w-[150px] mx-auto mb-[25px]">
                      <CustomButton
                        handleClickEvent={handleStakeAll}
                        isProcessing={isButtonProcessing}
                        text={"Stake All"}
                      />
                    </div>
                  }
                  handleUnstakeAll={
                    <div className="w-[150px] mx-auto mb-[25px]">
                      <CustomButton
                        handleClickEvent={handleUnstakeAll}
                        isProcessing={isButtonProcessing}
                        text={"Unstake All"}
                      />
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
