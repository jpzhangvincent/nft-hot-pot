import styles from "../styles/Home.module.css";
import InstructionsComponent from "../components/InstructionsComponent";
import NftGallery from "../components/nftGallery.jsx"
import NftCollectionInfoDisplay from "../components/nftCollectionInfoDisplay.jsx"
import NFTMintingPage from "../components/NftMinter.jsx"

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        {/* <InstructionsComponent></InstructionsComponent> */}
        <NftGallery walletAddress={"0x454bf2056d13Aa85e24D9c0886083761dbE64965"} chain={"ETH_MAINNET"} />
        {/* <NftCollectionInfoDisplay /> */}
      </main>
    </div>
  );
}
