import { useEffect, useState } from "react";
import styles from "../styles/NftCollectionInfoDisplay.module.css";


export default function NftCollectionInfoDisplay({ collectionAddress, chain }) {
  const [isLoading, setIsLoading] = useState(false);

  const [contractMetadata, setContractMetadata] = useState();
  const getContractMetadata = async () => {
    setIsLoading(true);
    const contractMetadata = await fetch("/api/getNftContractMetadata", {
      method: "POST",
      body: JSON.stringify({
        address: collectionAddress,
        chain: chain,
      }),
    }).then((res) => res.json());

    setContractMetadata(contractMetadata);
    setIsLoading(false);
  };
  useEffect(() => {
    getContractMetadata();
  }, []);
  return (
    <>
      {contractMetadata && (
        <div
          className={styles.nft_collection_info_panel_container}
          style={{ "background-image": `url()` }}
        >
          <div className={styles.header}>
            <div className={styles.top_row}>
              <div className={styles.image_title_container}>
                <div className={styles.image_container}>
                  <img src={contractMetadata.imageUrl}></img>
                </div>
                <div>
                  <div className={styles.collection_name_container}>
                    <h1 className={styles.collection_name}>
                      {contractMetadata.name}
                    </h1>
                    {contractMetadata.verified == "verified" ? (
                      <img
                        src={
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                        }
                        width="20px"
                        height="20px"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={styles.social_buttons_container}>
                <a
                  rel={"noreferrer"}
                  target={"_blank"}
                  href={`https://twitter.com/${contractMetadata.twitter_username}`}
                >
                  <img
                    width={"28px"}
                    height={"28px"}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png"
                  ></img>
                </a>
                <a
                  rel={"noreferrer"}
                  target={"_blank"}
                  href={contractMetadata.discord_url}
                >
                  <img
                    width={"28px"}
                    height={"28px"}
                    src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
                  ></img>
                </a>
              </div>
            </div>

            <div className={styles.info_container}>
              <div className={styles.description_container}>
                <p>{contractMetadata.descritpion}</p>
              </div>
              <div className={styles.secondary_info}>
                <div>
                  <p className={styles.title}>Floor</p>
                  <p className={styles.value}>{contractMetadata.floorPrice}</p>
                </div>
                <div>
                  <p className={styles.title}>Total Supply</p>
                  <p className={styles.value}>{contractMetadata.totalSupply}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}