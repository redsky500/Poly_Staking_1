import type { NextPage } from "next";
import { useState, useEffect } from "react";
import MintCards from "../components/MintCards";
import CountdownTimerCmp from "../components/CountdownTimer";
import { getPrizeList } from "../services/nft-prize-list-service";
import { getNFTCollection } from "../services/nft-collections-service";
import Table from "../components/table";
import Link from "next/link";
import Loader from "react-spinners/HashLoader";

export interface NFTType {
  mint: string;
  staked: boolean;
  stakedTime: number;
}

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader />
  </div>
);

const WeeklyLottery: NextPage = ({ LOTTERYContract }: any) => {
  const [prizeList, setPrizeList] = useState<any>([]);
  const [NFTList, setNFTList] = useState<any>([]);
  const [pageLoad, setPageLoad] = useState<boolean>(false);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    setPageLoad(true);
    const storedNFTs = await getNFTCollection();
    const allPrizes = await getPrizeList();
    const filteredNFTs = storedNFTs.filter((item: any) => item.isStakeDisabled);
    setNFTList(filteredNFTs);
    const currentLottery = allPrizes.find((item: any) => !item.isCompleted);
    setPageLoad(false);
    if (!currentLottery) {
      return;
    }
    setPrizeList([...currentLottery?.prizeNFTs, ...currentLottery?.prizeETHs]);
  };

  return (
    <div className="flex flex-col gap-4 w-full px-4 sm:px-16 py-4 bg-transparent font-inter text-center text-[20px] mb-8">
      <div className="w-full block rounded text-center border-[1px] rounded-xl bg-countdownBG">
        <div className="p-6">
          <h5 className="mb-2 text-xl font-medium leading-tight text-white dark:text-neutral-50">
            Weekly Draw Results
          </h5>
        </div>
      </div>

      <div className="flex flex gap-4 lg:gap-8 xs:gap-4 sm:gap-4 md:gap-4 flex-col sm:flex-col md:flex-col lg:flex-row">
        <div className="w-full block rounded text-center shadow-lg border-[1px] rounded-xl bg-countdownBG">
          <div className="p-6 flex justify-center items-center h-full">
            {pageLoad ? (
              loader
            ) : (
              <h5 className="mb-2 text-xl font-medium leading-tight text-white dark:text-neutral-50">
                <CountdownTimerCmp LOTTERYContract={LOTTERYContract} />
              </h5>
            )}
          </div>
        </div>
        <div className="w-full block rounded text-center shadow-lg border-[1px] rounded-xl bg-countdownBG">
          <div className="p-6">
            {pageLoad ? (
              loader
            ) : (
              <>
                <h5 className="mb-2 text-xl font-medium leading-tight text-white dark:text-neutral-50">
                  Total Participate: {NFTList.length}
                </h5>
                {NFTList.length > 0 && <Table />}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full block rounded text-center shadow-lg border-[1px] rounded-xl bg-countdownBG">
        <div className="p-6">
          {pageLoad ? (
            loader
          ) : (
            <>
              <h5 className="mb-4 text-xl font-medium leading-tight text-white dark:text-neutral-50">
                Prize List
              </h5>
              <div className="flex text-white flex-wrap justify-center items-center xl:w-full gap-[20px] px-[16px]">
                {prizeList?.length
                  ? prizeList.map((mint: any, index: number) => (
                      <MintCards
                        key={mint._id || index}
                        userNFT={mint}
                        storedNFTs={NFTList}
                        isLotteryPage={true}
                      />
                    ))
                  : "The Lottery is not started yet."}
              </div>
            </>
          )}
          <div className="flex justify-center align-center pt-[25px]">
            <Link href="/prizeList">
              <button className="bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded cursor-pointer">
                GO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLottery;
