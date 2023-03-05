// This example shows how to make a decentralized price feed using multiple APIs

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const contractaddress = args[0]
const tokenid = args[1]
const chain = args[2]

if (
  secrets.covalentApiKey == "" ||
  secrets.covalentApiKey === "Your Cavalent API key is missing"
) {
  throw Error(
    "Your Cavalent API key is missing"
  )
}

// To make an HTTP request, use the Functions.makeHttpRequest function
// Functions.makeHttpRequest function parameters:
// - url
// - method (optional, defaults to 'GET')
// - headers: headers supplied as an object (optional)
// - params: URL query parameters supplied as an object (optional)
// - data: request body supplied as an object (optional)
// - timeout: maximum request duration in ms (optional, defaults to 10000ms)
// - responseType: expected response type (optional, defaults to 'json')

// Use multiple APIs & aggregate the results to enhance decentralization
const covalentNFTRequest = Functions.makeHttpRequest({
  url: `https://api.covalenthq.com/v1/${chain}/nft/${contractaddress}/metadata/${tokenid}/?key=${secrets.covalentApiKey}`,
})
const alchemyNFTRequest = Functions.makeHttpRequest({
  url: `https://${chain}.g.alchemy.com/nft/v2/${secrets.alchemyApiKey}/getContractMetadata?contractAddress=${contractaddress}&tokenId=${tokenid}&refreshCache=false`,
})

let infuraChain = "" ;
  switch(chain){
    case "eth-mainnet":
      infuraChain = "1";
      break; 
    case "MATIC_MAINNET":
      infuraChain = "137";
      break;
    case "ETH_GOERLI":
      infuraChain = '5'
      break;
    case "MATIC_MUMBAI":
      infuraChain ='80001';
      break; 
  } 
  export const infuraAuth =
  'Basic ' +
  Buffer.from(
    secrets.infuraAPiKey + ':' + secrets.infuraAPiKeySecret,
  ).toString('base64');
const infuraNFTRequest = Functions.makeHttpRequest({
  url: `https://nft.api.infura.io/networks/${infuraChain}/nfts/${contractaddress}/tokens/${tokenid}?resyncMetadata=false`,
  headers: { "Authorization": `${infuraAuth}` },
})
// This dummy request simulates a failed API request
const badApiRequest = Functions.makeHttpRequest({
  url: `https://badapi.com/price/symbol/${badApiCoinId}`,
})

// First, execute all the API requests are executed concurrently, then wait for the responses
const [covalentResponse, alchemyResponse, infuraResponse, badApiResponse] = await Promise.all([
  covalentNFTRequest,
  alchemyNFTRequest,
  infuraNFTRequest,
  badApiRequest,
])

const nftdescription_data = []

if (!covalentResponse.error) {
  nftdescription_data.push(covalentResponse.data.items[0].nft_data.external_data.description)
} else {
  console.log("Covalent Error")
}
if (!alchemyResponse.error) {
  nftdescription_data.push(alchemyResponse.data.metadata.description)
} else {
  console.log("Alchemy Error")
}
if (!infuraResponse.error) {
  nftdescription_data.push(infuraResponse.data.metadata.description)
} else {
  console.log("infura Error")
}
// A single failed API request does not cause the whole request to fail
if (!badApiResponse.error) {
  nftdescription_data.push(httpResponses[3].data.nftdescription)
} else {
  console.log(
    "Bad API request failed. (This message is expected to demonstrate using console.log for debugging locally with the simulator)"
  )
}

// At least 3 out of 4 prices are needed to aggregate the median price
if (prices.length < 3) {
  // If an error is thrown, it will be returned back to the smart contract
  throw Error("More than 1 API failed")
}

// Select the most comprehensive description for the NFT
const result = nftdescription_data.sort((a, b) => b.length - a.length)[0]
console.log('NFT Token description', result)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(result)
