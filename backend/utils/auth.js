import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AUTH_URL = process.env.AUTH_URL;

const credentials = {
    companyName: process.env.COMPANY_NAME,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL,
    rollNo: process.env.ROLL_NO
};

let authToken = null;
let tokenExpiration = null;


const generateToken = async () => {
    try {
        const response = await axios.post(AUTH_URL, credentials);
        authToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert expiry to milliseconds
        console.log("New Auth Token Generated");
        return authToken;
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw new Error("Failed to obtain authentication token");
    }
};

export const getAuthToken = async () => {
    if (!authToken || Date.now() >= tokenExpiration) {
        return await generateToken();
    }
    return authToken;
};
