# NFT Hot Pot: On-Chain AI Gen Platform

[ETHDenver Presentation](https://docs.google.com/presentation/d/1qgnQlnpZBb8RAfWI0yK9XUZrxenIdtdG8moeLtU4OQg/edit?usp=sharing)

[Deployed Web App](https://nft-hot-pot-poc.vercel.app/)

NFT Hot Pot is an on-chain NFT AI generator that enables a user to select existing NFTs as inputs and generate a new unique NFT that mixes the artistic features of the inputed NFT’s. The created NFT can be dynamically updated by being added to the mixer again.  The metadata of the input NFT's are extracted using the Covalent and Alchemy NFT API.  The metadata text is then used as input for ChatGPT to generate a DALL-E image prompt which is fed into DALL-E to generate an image.  Both the ChatGPT and DALL-E API's are called by Chainlink Functions.  The tool is available on the Ethereum, Polygon, Scroll, and NEAR Aurora chains with possibilities of other chains down the line. NFT Hot Pot provides a unique opportunity to combine and collaborate NFT’s across different collections.

# **Problem Statement**

- It is the stepping stone for AI Gen tools on chain, where the use of NFT’s can create an creditable development platform and tracking system for generated art
- Collaboration Between NFT Projects: Foster friendship instead of hostility across NFT collections as there are few ways to have different NFT’s projects interact or integrate with each other
    - Increased Exposure: Collaboration between NFT collections can help to increase exposure and visibility for all the collections involved. By pooling audiences and cross-promoting each other's work, collections can reach a wider audience and attract new collectors and investors.
- Incentivize artists to move art on-chain to collect royalties if their art is used for generative creations
- Finally, this will help fill a gap in the NFT space regarding the lack of dynamic NFT’s, as generated NFT’s can be changed further by being thrown back into the mixer, adding a whole slew of potential art and gamification possibilities.
- Prompt engineering can be challenging for generative Art. We come up with an innovative approach to automatically suggest a "creative" prompt from chatGPT by synthesizing the NFT metadata with a pre-defined prompt. This helps lower the barriers for normal users to onboard and experient with web3 dApp.

# Smart contract Deployment
| Chain/Protocol          | Contract/Function Name | Contract Address                                                                                                                     | Code File                   | Note                        |
|----------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|-----------------------------|
| Polygon Mumbai | NFTAIMixer    | [0xe15560062F770d3fc89A8eFc0E4774dF8Be7F99b](https://mumbai.polygonscan.com/address/0xe15560062F770d3fc89A8eFc0E4774dF8Be7F99b#code) | backend/contract/NFTAIMixer.sol | ERC721 with royalty         |
| Base Testnet   | NFTAIMixer    | [0x098914A6Cc4A2F5Cb0A626F2D0998F50A0b9504a](https://base-goerli.blockscout.com/address/0x098914A6Cc4A2F5Cb0A626F2D0998F50A0b9504a)  | backend/contract/NFTAIMixer.sol | `yarn deploy:baseTestnet`   |
| Aurora Testnet | NFTAIMixer    | [0x378c52E95d11fa6F78E3B948936DefdF5981cfc8](https://explorer.testnet.aurora.dev/address/0x378c52E95d11fa6F78E3B948936DefdF5981cfc8) | backend/contract/NFTAIMixer.sol | `yarn deploy:auroraTestnet` |
| Scroll Testnet | NFTAIMixer    | [0x378c52E95d11fa6F78E3B948936DefdF5981cfc8](https://blockscout.scroll.io/address/0x378c52E95d11fa6F78E3B948936DefdF5981cfc8) | backend/contract/NFTAIMixer.sol | `yarn deploy:scrollTestnet` |
| Chainlink Functions |  OpenAIChatGPT-api    | OxC5dd70292f94C9EA88a856d455C43974BA756824 | chainlink_functions/OpenAIChatGPT-api.js | Subscription ID: 272 |
| Chainlink Functions |  OpenAIDALLE-api    | 0x454bf2056d13Aa85e24D9c0886083761dbE64965 | chainlink_functions/OpenAIDALLE-api.js | Subscription ID: 279 |

Since the workflow depends on the Chainlink Functions which only supports Eth and Polygon networks, the frontend UI focuses on the polygon mumbai integration.

# Workflow

## Mint Workflow

- Mint Workflow: A generative AI algorithm that creates a generated NFT based on NFTs selected by the user

### Beginning User Interaction

- User enters NFT Hot Pot Dapp
- User connects wallet using ‘Connect’ button in top right of screen
    - User selects network and address
- User’s wallet NFT’s are listed in the Dapp
- User selects any number of NFT’s, ideally multiple

### Auto-Prompt Creation

- Interface populates prompt field using ChatGPT with the description of each NFT in an image prompt
    - Prompt created is an ask to create a DALL-E image prompt containing the two character's metadata
    - Future developments to contain more rich image generation capabilities not yet live
    - Example:
        - Based on a description of the below characters, can you please provide a DALL-E image prompt detailing a picture involving the two? Character 1: Blue cloak Azuki female with rings. Character 2: Golden Bored Ape with pirate hat
- User can edit prompt

Note that the success is depending on the availability and quality of the NFT metadata, which supports the value and promise of bringing the creative art process on-chain. 

### Image Generation

- User generates NFT by clicking ‘Generate’ button
- Image generated by DALL-E appears on Dapp
    - NFT image has 'prompt', 'temperature', 'model', ‘news’ metadata fields, in addition to its descriptive metadata fields
- User has option to rerun image generation or edit prompt
- User can then mint NFT to wallet

## Dynamic Workflow:

- User selects any number of NFT’s and any original ‘NFT Hot Pot’ generated NFT from wallet
- Interface populates prompt field using ChatGPT with the description of each NFT in an image prompt
    - Prompt should be an ask to create a DALL-E prompt that will create an image containing the two character's metadata
    - Future developments to contain more rich image generation capabilities
- User has option to rerun image generation or edit prompt
- User updates NFT (permanently)

# Video Demo

[Video Demo](https://www.youtube.com/watch?v=LB0xvEnllxI)

# Future Improvements

- **NFT upload as input:** Image uploading would allow for more accurate generated images, enriching the resulting art.
- **NFT inpainting and outpainting:** DALL-E editor would enable more user control and customization over the generated image. Tools such as Midjourney Blend (no API currently) would allow for further flexibility
- **Dynamic theft security:** The NFT can be dynamically updated to blackout if stolen
- **Platform for the on-chain AI gen NFTs:** Create a valuable resource for developer to being transitioning AI technologies onto the blockchain
- **Marketplace for AI gen mixed art:** Carve out a niche space in the market for combined art
- **Gameification** enable competitive incentive system for generating dynamic art metadata

# Primary Users

- Any NFT holder, enthusiast, or fanatic that would like to explore further creativity for their  interactions across collections. This includes gamers, collectors, and just about any NFT user. In addition, this provides an opportunity for like minded people to share their unique art with each other and allow users to indirectly own other collections
- NFT artists who would like to receive credit and royalties for art used in AI image generators. There is an additional incentive of additional royalties when the NFT is returned to NFT Hot Pot to be dynamically updated.
- Developers, who want to experiment with decentralized on-chain AI tools that can be incorporated into the generative workflow. Furthermore, an AI workflow that can synthesize from multiple images using on-chain NFT metadata when there exists no end-to-end image AI mixer algorithm in the market can be utilized as a development tool.

# Challenges Faces By Project

- Creating aesthetically pleasing art with the correct prompt: At the moment, NFT Hot Pot is limited by the metadata available from each NFT. Current limitations in the DALL-E API and Hackathon time limits prevent us from adding novel AI techniques such as inpainting, outpainting, 3D creations, and blending. Furthermore, limitations in current generative AI API's prevent two or more specific images to show up as near exact copies within a generative image. This level of accuracy would create a stronger affinity for the art from NFT users as the input NFT's would be less modified from their original state.
- Legality of using someone else’s art: There is always an issue of legality when it comes to using other's art for inspiration, as it generally is accompanied by potential accusations of plagiarism. The royalty system and chain ledger seeks to address this problem, but is in no way a perfect and still subject to legal action.
- Creating a healthy ecosystem to excite users to generate NFT’s: Like any NFT project, obtaining traction and market is one of the most difficult challenges.  Beyond traditional means of marketing, creating momentum and community is a competitive environment with other NFT collections vying for the same attention from NFT collectors.  Reputation and popularity are further challenges that all NFT’s must face in this market.

# Bounties

- Chainlink Bounty: Chainlink Functions is used to integrate OpenAI API’s such as ChatGPT for auto-test prompt generation and DALL-E for image generation.   The enablement of the dapp to reach web2 API’s quickly and conveniently is a huge saver for the dev team.   In addition, Chainlink Functions was able to provide the most rich NFT metadata in order to enhance the robustness and data quality of NFT metadata.  However, we were not able to fully integrate this functionality without further testing.  In addition, we could not access the Infura API key which prevented the full development of the feature, however this is a promising use case for future development
- ETHStorage: ETHStorage was easy and straightforward to use in storing NFT metadata.  The dapp could be defined as a dynamic on-chain dapp that uses the web3:// Access Protocol
- Covalent:  We primarily used Covalent to synthesize multiple images for analysis in addition to Node.js API integration testing, proving the API to be useful in multiple facets of integration.  But we also noticed that the data coverage of metadata from Covalent was lacking compared to the Alchemy API.
- Graph: The build and deployment of a custom subgraph using the GraphQL API was successfully used to index data from a smart contract.  The blockchain data was queried to the dapp.
- Infura: The Infura API key was not available to hackathon users the past few days.    We had requested the key to be released in the official ETHDenver discord to no avail.  As such, Infura was not implemented into the app.
- Near Aurora: Near Aurora was added as a layer.  The online documentation was easy to follow for the hardhat implementation.
- Polygon: We not only decided to deploy to Polygon, but we deployed there first based on Polygon’s growing reputation and low fees in the space.
- Base: Base also proved to be an easy later to add, with minimal additions to the config file. 
- Stellar: TBD
- Scroll: Scroll layer was also an easy add.  A challenge was that one of the docs on the bounty description was a dead URL.  We were still able to find resources online and add the network.
- Lens: The Lens protocol share button was easily implemented into the front end, thanks to the html snippet provided in the tutorial.   The button worked as intended and highlighted the important of having easy to use buttons/widgets/attachments to pages when wanting to expand a protocol such as Lens.
