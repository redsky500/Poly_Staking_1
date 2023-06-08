import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  arbitrumGoerli,
  baseGoerli,
  goerli,
  metisGoerli,
  optimismGoerli,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ownerAddress = "0x94756fe94DB4761D40ff0d900887eb95811f49e1";
export default function Header() {
  const { chains, provider } = configureChains(
    [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      arbitrumGoerli,
      baseGoerli,
      goerli,
      metisGoerli,
      optimismGoerli,
    ],
    [
      alchemyProvider({ apiKey: "A2lxdLrej8vanUUK4wAY3pniny2FEL5L" }),
      publicProvider(),
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: "lottery-app",
    projectId: "96ffdd7d9c9cfebf2ba96192b342e23f",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  const [active, setActive] = useState("dashboard");
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setActive(router.pathname);
    const userWalletInfo = localStorage?.getItem("wagmi.store") || "{}";
    const walletOwnerAddress =
      JSON.parse(userWalletInfo)?.state?.data?.account || "";
    if (walletOwnerAddress.toLowerCase() == ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [router]);

  return (
    <header className="w-full h-[90px]">
      <div className="w-full z-[9999] fixed flex justify-center xs:justify-between items-center px-8 sm:px-16 xl:px-32 py-4">
        <div className="logo cursor-pointer flex items-center justify-center md:justify-between hidden xs:block">
          <ul className="grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-lg p-1">
            <li
              onClick={() => setActive("/")}
              className={
                active === "/"
                  ? "flex justify-center bg-blue-100 font-semibold rounded-lg shadow text-indigo-900 py-2 px-4"
                  : "flex justify-center py-2 px-4"
              }
            >
              <Link href="/">Dashboard</Link>
            </li>
            <li
              onClick={() => setActive("/weeklyLottery")}
              className={
                active === "/weeklyLottery"
                  ? "flex justify-center bg-blue-100 font-semibold rounded-lg shadow text-indigo-900 py-2 px-4"
                  : "flex justify-center py-2 px-4"
              }
            >
              <Link href="/weeklyLottery">Lottery</Link>
            </li>
            <li
              onClick={() => setActive("/prizeList")}
              className={
                active === "/prizeList"
                  ? "flex justify-center bg-blue-100 font-semibold rounded-lg shadow text-indigo-900 py-2 px-4"
                  : "flex justify-center py-2 px-4"
              }
            >
              <Link href="/prizeList">Draw Results</Link>
            </li>
            {isOwner && (
              <li
                onClick={() => setActive("/AdminPanel")}
                className={
                  active === "/AdminPanel"
                    ? "flex justify-center bg-blue-100 font-semibold rounded-lg shadow text-indigo-900 py-2 px-4"
                    : "flex justify-center py-2 px-4"
                }
              >
                <Link href="/AdminPanel">Admin Panel</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-4">
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton
                chainStatus="none"
              />
            </RainbowKitProvider>
          </WagmiConfig>
        </div>
      </div>
    </header>
  );
}
