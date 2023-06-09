import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SimpleCarousel from "../components/SimpleCarousel";
import { errorToast } from "../services/toast-service";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PrizeList: NextPage = ({ LOTTERYContract }: any) => {
  const [currentLotteryPrize, setCurrentLotteryPrize] = useState<any>({});
  const [currentLotteryDate, setCurrentLotteryDate] = useState<any>(null);
  const [currentLotteryParticipants, setCurrentLotteryParticipants] =
    useState<any>(null);

  useEffect(() => {
    initialAsyncFunc({});
  }, []);

  const initialAsyncFunc = async (payload: any) => {
    // const currentLottery = await getCurrentLotteryById(payload);
    // const participants = await getLotteryParticipants(payload);
    // const utcDate = new Date(currentLottery.utcTimestamp * 1000);
    // const targetDate = new Date(
    //   utcDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    // );
    // const currentMonth = targetDate.toLocaleString("en-US", { month: "short" });
    // const currentDay = targetDate.getDate();
    // setCurrentLotteryDate(`${currentDay || "-"} ${currentMonth || "-"}`);
    // setCurrentLotteryParticipants(participants?.participants?.length || "-");
    // setCurrentLotteryPrize(currentLottery);
  };

  const handlePreviousLottery = () => {
    const lotteryId = currentLotteryPrize.lotteryId - 1;
    if (lotteryId >= 1) {
      setCurrentLotteryPrize(null);
      setCurrentLotteryDate(null);
      setCurrentLotteryParticipants(null);
      initialAsyncFunc({ lotteryId: lotteryId });
    } else {
      errorToast("This is the first lottery!");
    }
  };
  const handleNextLottery = async () => {
    // const currentLottery = await getCurrentLotteryById({});
    // const lotteryId = currentLotteryPrize?.lotteryId + 1;
    // if (!currentLottery || lotteryId > currentLottery.lotteryId) {
    //   return errorToast("This is the last lottery!");
    // }
    // setCurrentLotteryPrize(null);
    // setCurrentLotteryDate(null);
    // setCurrentLotteryParticipants(null);
    // initialAsyncFunc({ lotteryId: lotteryId });
  };

  return (
    <>
      <div className="box-content p-4 border-4 border-teal-400 bg-[#0000005c] rounded-[15px] m-auto w-[calc(100%_-_100px)]">
        {/* we have to create a component for this */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <button
              type="button"
              className="inline-block rounded flex items-center gap-[10px] bg-black px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
              onClick={() => {
                handlePreviousLottery();
              }}
            >
              <span>
                <FaArrowLeft />
              </span>
              <span>Draw #{currentLotteryPrize?.lotteryId}</span>
            </button>
          </div>
          <div className="flex-1">
            <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-white font-Rubik glowing-text-white">
              Draw #{currentLotteryPrize?.lotteryId}
            </h1>
          </div>
          <div className="flex-1">
            <button
              type="button"
              className="inline-block ml-auto rounded flex items-center gap-[10px] bg-black px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
              onClick={() => {
                handleNextLottery();
              }}
            >
              <span>Draw #{currentLotteryPrize?.lotteryId}</span>
              <span>
                <FaArrowRight />
              </span>
            </button>
          </div>
        </div>
        {/* we have to create a component for this */}
        <div className="flex justify-between items-center p-[10px] bg-[#5f9ea069] rounded-[10px]">
          <div className="flex-1">
            <div>
              <label className="glowing-text-white font-[800] text-[darkgray]">
                Draw Date
              </label>
            </div>
            <div>
              <h1 className="font-[800] font-size-20 text-white">
                {currentLotteryDate}
              </h1>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <label className="glowing-text-white font-[800] text-[darkgray]">
                Total Prizes
              </label>
            </div>
            <div>
              <h1 className="font-[800] font-size-20 text-white">10</h1>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <label className="glowing-text-white font-[800] text-[darkgray]">
                Participants
              </label>
            </div>
            <div>
              <h1 className="font-[800] font-size-20 text-white">
                {currentLotteryParticipants}
              </h1>
            </div>
          </div>
        </div>

        <div className="my-[2rem] flex flex-wrap gap-[17px] justify-center">
          {currentLotteryPrize?.lotteryId ? (
            <SimpleCarousel
              LOTTERYContract={LOTTERYContract}
              currentLotteryPrize={currentLotteryPrize}
            />
          ) : (
            <h1 className="text-5xl font-medium leading-tight text-white font-Rubik glowing-text-white">
              Please wait till Lottery End.
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default PrizeList;
