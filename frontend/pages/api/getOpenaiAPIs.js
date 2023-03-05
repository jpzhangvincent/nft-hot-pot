// just testing OpenAI APIs
import { config as loadEnv } from 'dotenv';
import { Configuration, OpenAIApi} from 'openai'
loadEnv();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runTextCompletion (prompt) {
    try {
        // console.log(prompt)
        const completion = await openai.createCompletion({
            model: "text-davinci-003", //latest chatGPT model
            prompt: prompt,
            max_tokens: 100,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        console.log(completion.data.choices[0].text.trim());

        return JSON.stringify({
            success: true,
            data: completion.data.choices[0].text.trim(),
            model: "gpt-3.5-turbo",
          })
    } catch (error) {
        return JSON.stringify({
            success: false,
            error: error.response
              ? error.response.data
              : "There was an issue on the server",
          });
    }
}

// runTextCompletion(`How are you today?`);

async function runChatCompletion (prompt) {
    try {
        console.log(prompt)
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", //latest chatGPT model
            messages: [{role: "system", content: "You are a helpful assistant about NFT and art. Answer as concisely as possible."},
                       {role: "user", content: prompt}],
            max_tokens: 150,
            temperature: 0.3,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        console.log(completion.data.choices[0].message);

        return JSON.stringify({
            success: true,
            data: completion.data.choices[0].message,
            model: "gpt-3.5-turbo",
          })
    } catch (error) {
        return JSON.stringify({
            success: false,
            error: error.response
              ? error.response.data
              : "There was an issue on the server",
          });
    }
}

runChatCompletion("GM");