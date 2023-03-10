require('dotenv').config();
const key = process.env.PINATA_API_KEY;
const secret = process.env.PINATA_API_SECRET;
const axios = require('axios');

const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
        });
};

export default async function handler(req, res) {
    const response = await pinJSONToIPFS(req.body);
    res.status(200).json(response);
}