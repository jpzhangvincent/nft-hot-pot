import axios from 'axios';

export default async (req, res) => {
    console.log(req, "Here is the request")
  try {
    // Make an API call using Axios
    const response = await axios.get(`https://api.niftygateway.com/nifty/metadata-minted/?contractAddress=${req.query.contractAddress}&tokenId=${req.query.tokenId}`);

    // Return the response data as JSON
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
