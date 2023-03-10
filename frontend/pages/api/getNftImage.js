const { Configuration, OpenAIApi } = require("openai");
//require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

export default async function autoPromptGeneration(req, res) {
  try {
    const { imagePrompt } = JSON.parse(req.body);
    const response = await openai.createImage({
      prompt: imagePrompt,
      n: 1,  // Number of images to generate
      size: '256x256',
      response_format: 'url'
    });
    console.log(response.data.data[0].url)
    //const imageUrl = response.data.data[0].url;
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.toString() });
  }
}
