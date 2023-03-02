import styles from "../styles/NftMinter.module.css";
import { getNetwork, switchNetwork } from "@wagmi/core";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

export default function NFTMintingPage({
  pContractAddress,
  pTokenUri,
  pAbi,
  imgSrc,
}) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [txHash, setTxHash] = useState();
  const [isMinting, setIsMinting] = useState(false);

  const { isDisconnected } = useAccount();

  const mintNFT = async () => {
    const { chain } = getNetwork();
    if (chain.id != 80001) {
      try {
        await switchNetwork({
          chainId: 80001,
        });
      } catch (e) {
        return;
      }
    }
    const nftContract = new Contract(pContractAddress, pAbi, signer);
    try {
      const mintTx = await nftContract.safeMint(pTokenUri, address);

      setTxHash(mintTx?.hash);
      setIsMinting(true);
      await mintTx.wait();
      setIsMinting(false);
      setTxHash(null);
    } catch (e) {
      console.log(e);
      setIsMinting(false);
    }
  };

  return (
    <div className={styles.page_container}>
      <h1 className={styles.page_header}>Mint a CW3D NFT!</h1>

      <div className={styles.nft_image_container}>
        <img className={styles.nft_image} src={imgSrc} />
      </div>
      <div>
        <h1 className={styles.nft_title}>Mint a CW3D NFT!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
          iste assumenda et minima, nobis molestias? Dicta voluptatum laborum
          atque minus quis illo veniam a reiciendis aspernatur, eum ducimus
          voluptas consequuntur.
        </p>
      </div>
      {isDisconnected ? (
        <p>Connect your wallet to get started</p>
      ) : (
        <button
          className={`${styles.button} ${isMinting && `${styles.isMinting}`}`}
          disabled={isMinting}
          onClick={async () => await mintNFT()}
        >
          {isMinting ? "Minting" : "Mint NFT"}
        </button>
      )}

      {txHash && (
        <div className={styles.transaction_box}>
          <p>See transaction on </p>
          <a
            className={styles.tx_hash}
            href={`https://mumbai.polygonscan.com/tx/${txHash}`}
          >
            Mumbai Polygon Scan
          </a>
        </div>
      )}
    </div>
  );
}