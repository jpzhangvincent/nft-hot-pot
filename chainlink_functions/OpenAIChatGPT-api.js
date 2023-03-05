// This example shows how to make an on-chain API call for OpenAI Chat 

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const prompt = args[0]

if (
    !secrets.openaiApiKey
) {
    throw Error(
        "Need to set OPENAI_KEY environment variable"
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

// example request: 
// curl https://api.openai.com/v1/completions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}

// example response:
// {"id":"cmpl-6jFdLbY08kJobPRfCZL4SVzQ6eidJ","object":"text_completion","created":1676242875,"model":"text-davinci-003","choices":[{"text":"\n\nThis is indeed a test","index":0,"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":5,"completion_tokens":7,"total_tokens":12}}
const openAIRequest = Functions.makeHttpRequest({
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
      'Authorization': `Bearer ${secrets.openaiApiKey}`
  },
  data: { "model": "gpt-3.5-turbo", 
          "messages":[
            {
                "role": "system",
                "content": "You are a digital artist specialized in abstract art and interested in web3 and NFT. You want to create your own unique artist style with a vision to inspire creativity and positivity with AI.",
            },
             {"role": "user", "content": prompt},
          ], 
          "temperature": 0.2}
})

const [openAiResponse] = await Promise.all([
  openAIRequest
])
console.log("ChatGPT raw response", openAiResponse)

const result = openAiResponse.data.choices[0].message.content

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(result)



