import express from "express";
import axios from "axios";
import { getAuthToken } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const POSTS_URL = process.env.POSTS_URL;

if (!POSTS_URL) {
    console.error("ERROR: POSTS_URL is not defined in environment variables.");
}

// Define the correct route inside `/posts`
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate userId
        if (!/^\d+$/.test(userId)) {
            return res.status(400).json({ error: "Invalid userId. It must be a number." });
        }

        const token = await getAuthToken();

        // Fetch posts from the API
        const response = await axios.get(`${POSTS_URL}/${userId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching posts:", error.message);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                return res.status(error.response.status).json({
                    error: error.response.data || "API response error",
                });
            } else if (error.request) {
                return res.status(504).json({ error: "No response from the API" });
            } else {
                return res.status(500).json({ error: "Request failed" });
            }
        }

        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

export default router;
