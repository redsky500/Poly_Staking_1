/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Dashboard from "../components/dashboard";
import { Network, Alchemy } from "alchemy-sdk";
import { LOTTERY_CONTRACTADDRESS } from "../config";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";
const ethers = require("ethers");

const provider =
  typeof window !== "undefined" && window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

const Home: NextPage = () => {
  const Signer = provider?.getSigner();
  const LOTTERYContract = new ethers.Contract(
    LOTTERY_CONTRACTADDRESS,
    LOTTERYABI,
    Signer
  );
  const config = {
    apiKey: "hz0eALWx9lEGcKZ2qU3xMcHK3GfqTk0U",
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);

  return (
    <main className="w-full flex items-center h-[calc(100vh-180px)]">
      <Dashboard
        alchemy={alchemy}
        LOTTERYContract={LOTTERYContract}
      ></Dashboard>
    </main>
  );
};

export default Home;
