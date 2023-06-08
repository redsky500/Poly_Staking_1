import { ToastContainer } from "react-toastify";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { NFT_CONTRACTADDRESS, LOTTERY_CONTRACTADDRESS } from "../config";
import NFTMINTABI from "../../public/abi/NFTMINTABI.json";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageLoading from "../components/PageLoading";
import "../styles/style.scss";

function StakingApp({ Component, pageProps }) {
  const appProvider =
    typeof window !== "undefined" && window?.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;
  const Signer = appProvider?.getSigner();
  const NFTMintContract = new ethers.Contract(
    NFT_CONTRACTADDRESS,
    NFTMINTABI,
    Signer
  );
  const LOTTERYContract = new ethers.Contract(
    LOTTERY_CONTRACTADDRESS,
    LOTTERYABI,
    Signer
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      style={{
        background: "linear-gradient(45deg, #247BA0 0%, #FFFFB5 100%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Web3ReactProvider>
        <Header LOTTERYContract={LOTTERYContract} />
        <Component
          {...pageProps}
          NFTMintContract={NFTMintContract}
          LOTTERYContract={LOTTERYContract}
        />
        <ToastContainer style={{ fontSize: 14 }} />
        <PageLoading loading={false} />
        <Footer />
      </Web3ReactProvider>
    </motion.section>
  );
}

export default StakingApp;
