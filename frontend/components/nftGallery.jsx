import { useEffect, useState } from "react";
import Modal from '../components/modal';
import Result from '../components/Result';
import styles from "../styles/NftGallery.module.css";
import { useAccount } from "wagmi";
import {
    getCurrentWalletConnected,
    mintNFT,
} from "../utils/interact.js";

export default function NFTGallery({}) {
	const [nfts, setNfts] = useState();
	const [walletOrCollectionAddress, setWalletOrCollectionAddress] =
		useState("vitalik.eth");
	const [fetchMethod, setFetchMethod] = useState("wallet");
	const [pageKey, setPageKey] = useState(false);
	const [spamFilter, setSpamFilter] = useState(true);
	const [isLoading, setIsloading] = useState(false);
	const { address, isConnected } = useAccount();
	const [wallet, setWallet] = useState("");
	const [chain, setChain] = useState(process.env.NEXT_PUBLIC_ALCHEMY_NETWORK);
	const [selectedNfts, setSelectedNfts] = useState([]);
	const [nftDetails, setNftDetails] = useState([]);
	const [imagePrompt, setImagePrompt] = useState(null);
	const [isimagePromptLoading, setIsimagePromptloading] = useState(false);
	const [imgs, setImgs] = useState();
	const [isImgLoading, setIsImgloading] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);
	const [modal, setModal] = useState(false);
	const [name, setName] = useState("");
  	const [description, setDescription ] = useState("");
	const [minting, setMinting ] = useState(false);
	const [status, setStatus] = useState("");
	const [result, setResult] = useState(false);

	useEffect(() => {
		// Here, you can add any logic that you want to happen immediately
		// after selectedNfts state changes.
		console.log(selectedNfts);
	  }, [selectedNfts]);
	
	const handleSelectNft = (nft) => {
		const index = selectedNfts.findIndex((selectedNft) => selectedNft.tokenId === nft.tokenId);
		if (index !== -1) {
		  setSelectedNfts((prevSelectedNfts) => {
			const newSelectedNfts = [...prevSelectedNfts];
			newSelectedNfts.splice(index, 1);
			return newSelectedNfts;
		  });
		} else {
		  setSelectedNfts((prevSelectedNfts) => [...prevSelectedNfts, nft]);
		}
	};

	const changeFetchMethod = (e) => {
		switch (e.target.value) {
			case "wallet":
				setWalletOrCollectionAddress("vitalik.eth");
				break;
			case "collection":
				setWalletOrCollectionAddress(
					"0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e"
				);
				break;
			case "connectedWallet":
				setWalletOrCollectionAddress(address);
				break;
		}
		setFetchMethod(e.target.value);
	};

	const generateTextPrompt = async () => {
		setImageUrl(null)
		setImagePrompt(null)
		setIsimagePromptloading(true)
		console.log("Text Prompt", chain)
		if (selectedNfts.length > 0) {
		  const detailsPromises = selectedNfts.map(async (nft) => {
			const { contract, tokenId } = nft;
			const res = await fetch('/api/getNftTokenMetadata', {
			  method: "POST",
			  'Content-Type': 'application/json',
			  body: JSON.stringify({
					contractaddress: contract,
					tokenid: tokenId,
					chain: chain
				}),
			}).then((res) => {
				return (res.json())});
			console.log("Metadata response:", res)
			const { name, tags, description, id, creator } = res;
			return { name, tags, description, id, creator };
		  });
	  
		  const nftDetailsTemp = await Promise.all(detailsPromises);
		  setNftDetails(nftDetailsTemp);
		  console.log(nftDetailsTemp, "Updated details");
		  const res = await fetch('/api/getImagePrompt', {
			method: "POST",
			'Content-Type': 'application/json',
			body: JSON.stringify({
				nftMetadata: nftDetails
			}),
			}).then((res) => res.json());
			console.log(res)
			setImagePrompt(res.imagePrompt.content);
		}
		setIsimagePromptloading(false)
	};

	const getNftImage = async () => {
		setIsImgloading(true)
		const res = await fetch('/api/getNftImage', {
			method: "POST",
			'Content-Type': 'application/json',
			body: JSON.stringify({
				imagePrompt
			}),
			}).then((res) => res.json());
		setImgs(res);
		const imageUrl = res[0].url;
		console.log("Generated Image URL:", imageUrl)	
		setImageUrl(imageUrl)
		setIsImgloading(false)
	};

	const handleMintClick = (imgUrl) => {
		setImageUrl(imgUrl)
		setModal(true);
	};

	const handleUseEffect = async () => {
		const { address, status } = await getCurrentWalletConnected();
		setWallet(address);
	  }
	
	function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                } else {
                    setWallet("");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a
                        target="_blank"
                        href={`https://metamask.io/download.html`}
                    >
                        You must install Metamask, a virtual Ethereum wallet, in
                        your browser.
                    </a>
                </p>
            );
        }
    }

	useEffect(() => {
		   handleUseEffect()
		   addWalletListener(); 
	   }, []);

	const onMintPressed = async () => { 
		console.log("OnMintPressed - adress: ", address)

		//const royaltyReceiverAddress = nftDetails[0].creator
		// upload metadata json file
		if (address) {
			setMinting(true);
			// upload image file
			const response = await fetch("/api/uploadImgFile", {
				method: "POST",
				body: JSON.stringify(imageUrl),
			});
			const data = await response.json();
			console.log("OnMintPressed: ", data)
			const { status } = await mintNFT(
				address,
				`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
				name,
				description,
				imagePrompt,
				nftDetails
			)
			setStatus(status);
			setMinting(false);
			setModal(false);
			setResult(true);
		} else {
			setModal(false);
			setMinting(false);
		}
	};
	
	const fetchNFTs = async (pagekey) => {
		setIsloading(true);
		setNfts();
		setSelectedNfts([]);
		const endpoint =
			fetchMethod == "wallet" || fetchMethod == "connectedWallet"
				? "/api/getNftsForOwner"
				: "/api/getNftsForCollection";
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				body: JSON.stringify({
					address:
						fetchMethod == "connectedWallet"
							? address
							: walletOrCollectionAddress,
					pageKey: pagekey ? pagekey : null,
					chain: chain,
					excludeFilter: spamFilter,
				}),
			}).then((res) => res.json());
			setNfts(res.nfts);
			if (res.pageKey) {
				setPageKey(res.pageKey);
			} else {
				setPageKey();
			}
		} catch (e) {}

		setIsloading(false);
	};

	useEffect(() => {
		fetchNFTs();
	}, [fetchMethod]);
	useEffect(() => {
		fetchNFTs();
	}, [spamFilter]);

	return (
		<div className={styles.nft_gallery_page}>
			<div>
				<div className={styles.fetch_selector_container}>
					<h2 style={{ fontSize: "20px" }}>Explore NFTs by</h2>
					<div className={styles.select_container}>
						<select
							defaultValue={"wallet"}
							onChange={(e) => {
								changeFetchMethod(e);
							}}
						>
							<option value={"wallet"}>wallet</option>
							<option value={"collection"}>collection</option>
							<option value={"connectedWallet"}>
								connected wallet
							</option>
						</select>
					</div>
				</div>
				<div className={styles.inputs_container}>
					<div className={styles.input_button_container}>
						<input
							value={walletOrCollectionAddress}
							onChange={(e) => {
								setWalletOrCollectionAddress(e.target.value);
							}}
							placeholder="Insert NFTs contract or wallet address"
						></input>
						<div className={styles.select_container_alt}>
							<select
								onChange={(e) => {
									console.log("select:",e.target.value)
									setChain(e.target.value);
									console.log("select2:",chain)

								}}
								defaultValue={process.env.ALCHEMY_NETWORK}
							>
								<option value="ETH_MAINNET" key= "1">Mainnet</option>
								<option value="MATIC_MAINNET" key= "2" >Polygon</option>
								<option value="ETH_GOERLI" key= "3">Goerli</option>
								<option value="MATIC_MUMBAI" key= "4">Mumbai</option>
							</select>
						</div>
						<div
							onClick={() => fetchNFTs()}
							className={styles.button_black}
						>
							<a>Search</a>
						</div>					
						<div
							onClick={() => generateTextPrompt()}
							className={styles.button_blue}
							> 
							<a>Generate a Prompt!</a>
						</div>
						<div className={styles.button_green}> 
							<a href="https://lenster.xyz/?text=Hello%20World!&url=https://nft-hot-pot-poc.vercel.app/&via=MyCoolApp&hashtags=lens,web3" 
							target="_blank"> Share to Lens </a> 			
						</div>
					</div>
				</div>
				<br/>
				{isimagePromptLoading ? (
							<div className={styles.loading_box}>
								<p>Generating a prompt...</p>
							</div>
				) : null}
				{imagePrompt && (
				<div className={styles.inputs_container_row}>
				<textarea id="w3review" name="w3review" rows="4" cols="50" value={imagePrompt || ""}
  onChange={(event) => setImagePrompt(event.target.value)}>
				{`${imagePrompt}`}
				</textarea>
				<div
					onClick={() => getNftImage()}
					className={styles.button_green}
				>
					<a>Generate Art!</a>
				</div>	
				</div>
				)}
				<br/>
				{isImgLoading ? (
							<div className={styles.loading_box}>
								<p>Generating an image...</p>
							</div>
				) : null}
				{imageUrl && (
				<div className={styles.inputs_container_row}>
					<img src={imageUrl}></img>
					<div
					onClick={() => handleMintClick(imageUrl)}
					className={styles.button_gold}
					>
					<a>Mint your Dynamic NFT!</a>
				</div>	
				</div>
				)}
			</div>

			{isLoading ? (
				<div className={styles.loading_box}>
					<p>Loading...</p>
				</div>
			) : (
				<div className={styles.nfts_display}>
						{nfts?.length ? (
							nfts.map((nft) => {
								const isSelected = selectedNfts.findIndex((selectedNft) => selectedNft.tokenId === nft.tokenId) !== -1;
								return <NftCard key={nft.tokenId} nft={nft} fetchMethod = {fetchMethod} isSelected={isSelected} onSelectNft={handleSelectNft}/>;
							})
						) : (
							<div className={styles.loading_box}>
								<p>No NFTs found for the selected address</p>
							</div>
						)}
				</div>
				
				// <div className={styles.nft_gallery}>
				// 	{nfts?.length && fetchMethod != "collection" && (
				// 		<div
				// 			style={{
				// 				display: "flex",
				// 				gap: ".5rem",
				// 				width: "100%",
				// 				justifyContent: "end",
				// 			}}
				// 		>
				// 			<p>Hide spam</p>
				// 			<label className={styles.switch}>
				// 				<input
				// 					onChange={(e) =>
				// 						setSpamFilter(e.target.checked)
				// 					}
				// 					checked={spamFilter}
				// 					type="checkbox"
				// 				/>
				// 				<span
				// 					className={`${styles.slider} ${styles.round}`}
				// 				></span>
				// 			</label>
				// 		</div>
				// 	)}

				// 	<div className={styles.nfts_display}>
				// 		{nfts?.length ? (
				// 			nfts.map((nft) => {
				// 				return <NftCard key={nft.tokenId} nft={nft} />;
				// 			})
				// 		) : (
				// 			<div className={styles.loading_box}>
				// 				<p>No NFTs found for the selected address</p>
				// 			</div>
				// 		)}
				// 	</div>
				// </div>
			)}

			{modal ? (
				<Modal
					address={address}
					setModal={setModal}
					minting={minting}
					setMinting={setMinting}
					status={status}
					setStatus={setStatus}
					img={imageUrl}
					name={name}
					setName={setName}
					setDescription={setDescription}
					description={description}
					onMintPressed={onMintPressed}
				></Modal>
			) : null}

			{result ? (
              <Result setResult={setResult} status={status}></Result>
          	) : null}

			{pageKey && nfts?.length && (
				<div>
					<a
						className={styles.button_black}
						onClick={() => {
							fetchNFTs(pageKey);
						}}
					>
						Load more
					</a>
				</div>
			)}
		</div>
	);
}
function NftCard({ nft, fetchMethod, isSelected, onSelectNft }) {
	const handleClick = () => {
		onSelectNft(nft);
	  };
	return (
		<div className={`${styles.card_container} ${isSelected ? styles.selected : ""}`} onClick={handleClick}>
			<div className={styles.image_container}>
				{nft.format == "png" ||
				nft.format == "jpg" ||
				nft.format == "jpeg" ||
				nft.format == "gif" ? (
					<img src={nft.media}></img>
				) : (
					<video src={nft.media} controls>
						Your browser does not support the video tag.
					</video>
				)}
			</div>
			<div className={styles.info_container}>
				<div className={styles.title_container}>
					<h3>{nft.title}</h3>
				</div>
				<hr className={styles.separator} />
				<div className={styles.symbol_contract_container}>
					<div className={styles.symbol_container}>
						<p>{nft.symbol}</p>

						{nft.verified == "verified" ? (
							<img
								src={
									"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
								}
								width="20px"
								height="20px"
							/>
						) : null}
					</div>
					<div className={styles.contract_container}>
						<p className={styles.contract_container}>
							{nft.contract.slice(0, 6)}...
							{nft.contract.slice(38)}
						</p>
						<img
							src={
								"https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"
							}
							width="15px"
							height="15px"
						/>
					</div>
				</div>

				<div className={styles.description_container}>
					<p>{nft.description}</p>
				</div>
			</div>
		</div>
	);
}