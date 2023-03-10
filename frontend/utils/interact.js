const Contract = require("web3-eth-contract");
const contractABI = require("../abi/nft_contract.json");

const alchemyKey = process.env.ALCHEMY_KEY;
const contractAddress = "0x835C450e7E0d398851dcCe594A395b17303a1edc";

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a
                            target="_blank"
                            href={`https://metamask.io/download.html`}
                        >
                            You must install Metamask, a virtual Ethereum
                            wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const mintNFT = async (address, url, name, description) => {
    //error handling
    if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        };
    }

    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //pinata pin request
    const pinataGet = await fetch("/api/uploadMetadataJson", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(metadata)
    })
    const pinataResponse = await pinataGet.json();
    console.log(pinataResponse);
    const tokenURI = pinataResponse.pinataUrl;
    //load smart contract
    window.contract = await new Contract(contractABI, contractAddress); //loadContract();

	console.log("mint address", address)
	console.log("mint url", tokenURI)
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: window.contract.methods
            .mintNFT(address, tokenURI)
            .encodeABI(), //make call to NFT smart contract
    };

    //sign transaction via Metamask
    try {
        const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log(
            "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" +
                txHash
        );
        return {
            success: true,
            status:
                "https://mumbai.polygonscan.com/tx/" +
                txHash,
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }
};