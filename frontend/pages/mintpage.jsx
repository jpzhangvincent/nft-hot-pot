import styles from "../styles/Home.module.css";
import NftCollectionInfoDisplay from "../components/nftCollectionInfoDisplay.jsx"
import NFTMintingPage from "../components/NftMinter.jsx"

export default function Mintpage() {
    return (
      <div>
        <main className={styles.main}>
            <Link href="/">
                <a className="mr-4 text-pink-500">
                Home
                </a>
            </Link>
            <Link href="/create-nft">
                <a className="mr-6 text-pink-500">
                Mint NFT
                </a>
            </Link>
          {/* <InstructionsComponent></InstructionsComponent> */}
          {/* <NftCollectionInfoDisplay /> */}
          {<NFTMintingPage />}
        </main>
      </div>
    );
  }