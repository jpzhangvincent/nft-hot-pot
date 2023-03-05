import { useEffect, useState } from "react";
import styles from "../styles/NftGallery.module.css";
import { useAccount } from "wagmi";

const contracaddress = '0xe15560062F770d3fc89A8eFc0E4774dF8Be7F99b' 

export default function NFTGallery({}) {
	const [nfts, setNfts] = useState();
	const [walletOrCollectionAddress, setWalletOrCollectionAddress] =
		useState("vitalik.eth");
	const [fetchMethod, setFetchMethod] = useState("wallet");
	const [pageKey, setPageKey] = useState(false);
	const [spamFilter, setSpamFilter] = useState(true);
	const [isLoading, setIsloading] = useState(false);
	const { address, isConnected } = useAccount();
	const [chain, setChain] = useState(process.env.NEXT_PUBLIC_ALCHEMY_NETWORK);
	const [selectedNfts, setSelectedNfts] = useState([]);
	const [nftDetails, setNftDetails] = useState([]);
	const [imagePrompt, setImagePrompt] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

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
			const { name, tags, description, id } = res;
			return { name, tags, description, id };
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
	};

	const getNftImage = async () => {
		const res = await fetch('/api/getNftImage', {
			method: "POST",
			'Content-Type': 'application/json',
			body: JSON.stringify({
				imagePrompt
			}),
			}).then((res) => res.json());
			console.log(res.imageUrl)
			const imageUrl = res.imageUrl;
			setImageUrl(imageUrl)
			// Download image from URL
	};
	
	const fetchNFTs = async (pagekey) => {
		setIsloading(true);
		setNfts();
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
							<a href="https://lenster.xyz/?text=Hello%20World!&url=https://mycoolapp.xyz&via=MyCoolApp&hashtags=lens,web3" 
							target="_blank"> Share to Lens </a> 			
						</div>
					</div>
				</div>
				<br/>
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
				{imageUrl && (
				<div className={styles.inputs_container_row}>
					<img src={imageUrl}></img>
					<div
					onClick={() => getNftImage()}
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