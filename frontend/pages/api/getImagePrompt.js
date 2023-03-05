const { Configuration, OpenAIApi } = require("openai");
//require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

// Initialize OpenAI API key

export default async function autoPromptGeneration(req, res) {
    console.log(req.body)
  const re= JSON.parse(req.body);
  const {nftMetadata} = re

  let contextStr = "";
  if (nftMetadata.length > 0) {
    // Randomly select nftMetadata
    const selectedNftMetadata = nftMetadata
    contextStr = selectedNftMetadata.reduce((acc, nd) => {
        console.log(acc,nd)
      let ndStr = "===============\n";
      if (nd.description && nd.description !== "") {
        ndStr += `Background: ${nd.description}\n`;
      }
      if (nd.tags && nd.tags.length > 0) {
        const attributes = nd.tags.map((tag) => tag.name).join(", ");
        ndStr += `Attributes: ${attributes}\n`;
      }
      return acc + ndStr;
    }, "");
  } else {
    // Use all nftMetadata
    contextStr = nftMetadata.reduce((acc, nd) => {
      let ndStr = "===============\n";
      if (nd.nft_description && nd.nft_description !== "") {
        ndStr += `Background: ${nd.nft_description}\n`;
      }
      if (nd.nft_attributes && nd.nft_attributes !== "") {
        ndStr += `Attributes: ${nd.nft_attributes}\n`;
      }
      return acc + ndStr;
    }, "");
  }

  const imgGenPromptStr = `Given the objects with the following context:\n ${contextStr}\nCan you provide a description on the artwork you would like to create and convey a message based on the above context? Please make it as concise as possible.`;
  console.log("Text Generation Prompt: ", imgGenPromptStr);

  try {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", //latest chatGPT model
    messages: [{role: "system", content: "You are a helpful You are a digital artist specialized in abstract art and interested in web3 and NFT. You want to create your own unique artist style with a vision to inspire creativity and positivity with AI. about NFT and art. Answer as concisely as possible."},
               {role: "user", content: imgGenPromptStr }],
    max_tokens: 300,
    temperature: 0.3,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
});
//console.log(response.choices)
  const imagePrompt = response.data.choices[0].message;
  res.status(200).json({ imagePrompt });
} catch (error) {
  console.error(error);
  if (error.response) {
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  }
  res.status(500).json({ message: error.toString() });
}

}
