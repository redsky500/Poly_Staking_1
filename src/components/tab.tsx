/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Loader from "react-spinners/HashLoader";

const loader = (
  <div className="flex items-center justify-center w-full py-[20px]">
    <Loader color={"white"} />
  </div>
);

const Tab = ({ NFTCards, moreButton, handleTabs }: any) => {
  const [currentTab, setCurrentTab] = useState("tab-1");
  const [isLoading, setIsLoading] = useState(false);

  const handleTab = (CurrentTab: string) => {
    setIsLoading(true);
    setCurrentTab(CurrentTab);
    handleTabs(CurrentTab);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 w-full text-white text-center my-[20px] mx-auto box-content p-4 border-4 border-teal-400 bg-[#0000005c] rounded-[15px]">
      <ul className="grid grid-flow-col text-center text-gray-500">
        <li className="cursor-pointer">
          <a
            onClick={() => {
              handleTab("tab-1");
            }}
            className={
              currentTab === "tab-1"
                ? `flex justify-center py-4 bg-white rounded-tl-lg rounded-tr-lg border-l border-t border-r border-gray-100`
                : `flex justify-center py-4 text-white`
            }
          >
            Stake View
          </a>
        </li>
        <li className="cursor-pointer">
          <a
            onClick={() => {
              handleTab("tab-2");
            }}
            className={
              currentTab === "tab-2"
                ? `flex justify-center py-4 bg-white rounded-tl-lg rounded-tr-lg border-l border-t border-r border-gray-100`
                : `flex justify-center py-4 text-white`
            }
          >
            Unstake View
          </a>
        </li>
      </ul>
      {isLoading ? (
        loader
      ) : (
        <div className="bg-[#0000005c] p-8 text-gray-700 rounded-lg -mt-[1px]">
          {!NFTCards.length ? (
            <div>No NFTs</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-[20px] justify-center">
                {NFTCards}
              </div>
              <div>{moreButton}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tab;
