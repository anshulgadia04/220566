import express from "express";
import axios from "axios";
import { getAuthToken } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const COMMENTS_URL = process.env.COMMENTS_URL;

// Fetch comments for a given post
router.get("/:postId", async (req, res) => {
    try {
        const token = await getAuthToken();
        const postId = req.params.postId;

        const response = await axios.get(`${COMMENTS_URL}/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

export default router;
