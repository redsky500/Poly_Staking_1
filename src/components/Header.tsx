import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

const ownerAddress = "0x1ACf4D4f22EA6506ccB5f49cC05200FDC31824EB";

export default function Header() {
  const { address: account } = useAccount();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (account?.toLowerCase() == ownerAddress?.toLowerCase()) {
      setIsOwner(true);
    }
  }, [account]);

  return (
    <header className="w-full h-[90px]">
      <div className="bg-[#0003] w-full z-[9999] fixed flex justify-center xs:justify-between items-center px-8 sm:px-16 xl:px-32 py-4">
        <div className="text-white">
          <h1 className="font-medium text-xl">
            <Link href="/">STAKING</Link>
          </h1>
        </div>
        <div className="flex items-center gap-[20px] text-white">
          <div className="font-medium text-xl">
            <Link href="/">Dashboard</Link>
          </div>
          {/* <div className="font-medium text-xl">
            <Link href="/prizeList">Draw Result</Link>
          </div> */}
          {isOwner && (
            <div className="font-medium text-xl">
              <Link href="/AdminPanel">Admin Panel</Link>
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <ConnectButton chainStatus="none" />
          </div>
        </div>
      </div>
    </header>
  );
}
