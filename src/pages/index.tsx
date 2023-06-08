/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Dashboard from "../components/dashboard";

export interface NFTType {
  mint: string;
  staked: boolean;
  stakedTime: number;
}

const Home: NextPage = () => {
  return (
    <main className="w-full xl:h-full flex items-center">
      <Dashboard></Dashboard>
    </main>
  );
};

export default Home;
