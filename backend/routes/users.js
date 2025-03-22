import express from "express";
import axios from "axios";
import { getAuthToken } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const USERS_URL = process.env.USERS_URL;
const POSTS_URL = process.env.POSTS_URL;

if (!USERS_URL || !POSTS_URL) {
    console.error("ERROR: USERS_URL or POSTS_URL is not defined in environment variables.");
}

// API to get the top 5 users with the highest post count
router.get("/", async (req, res) => {
    try {
        const token = await getAuthToken();

        // Fetch users
        const usersResponse = await axios.get(USERS_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const usersData = usersResponse.data;

        // Ensure the response has a "users" object
        if (!usersData || typeof usersData !== "object" || !usersData.users) {
            console.log("Invalid API response:", usersResponse.data);
            return res.status(500).json({ error: "Invalid API response format for users" });
        }

        // Convert users object into an array of { id, name }
        const users = Object.entries(usersData.users).map(([id, name]) => ({
            id,
            name
        }));

        // Fetch posts for each user and count them
        const userPostCounts = {};
        await Promise.all(users.map(async (user) => {
            try {
                const postsResponse = await axios.get(`${POSTS_URL}/${user.id}/posts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                userPostCounts[user.id] = postsResponse.data.posts.length || 0;
            } catch (error) {
                console.error(`Error fetching posts for user ${user.id}:`, error.message);
                userPostCounts[user.id] = 0;
            }
        }));

        // Sort users by post count in descending order and get the top 5
        const topUsers = users
            .map(user => ({
                id: user.id,
                name: user.name,
                postCount: userPostCounts[user.id] || 0,
            }))
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 5);

        res.status(200).json({ topUsers });
    } catch (error) {
        console.error("Error fetching top users:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

export default router;
