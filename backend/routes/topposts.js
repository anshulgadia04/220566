import express from "express";
import axios from "axios";
import { getAuthToken } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const USERS_URL = process.env.USERS_URL;
const POSTS_URL = process.env.POSTS_URL;
const COMMENTS_URL = process.env.COMMENTS_URL;

if (!USERS_URL || !POSTS_URL || !COMMENTS_URL) {
    console.error("ERROR: Missing USERS_URL, POSTS_URL, or COMMENTS_URL in environment variables.");
}


router.get("/top", async (req, res) => {
    try {
        const { type } = req.query;

        if (!type || !["popular", "latest"].includes(type)) {
            return res.status(400).json({ error: "Invalid type. Accepted values: latest, popular" });
        }

        const token = await getAuthToken();

        // Fetch all users
        const usersResponse = await axios.get(USERS_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = usersResponse.data;
        if (!usersData || typeof usersData !== "object" || !usersData.users) {
            console.error("Invalid API response for users:", usersResponse.data);
            return res.status(500).json({ error: "Invalid API response format for users" });
        }

        const users = Object.keys(usersData.users);
        let allPosts = [];

        // Fetch posts for each user
        await Promise.all(users.map(async (userId) => {
            try {
                const postsResponse = await axios.get(`${POSTS_URL}/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(postsResponse.data.posts)) {
                    allPosts = [...allPosts, ...postsResponse.data.posts];
                }
            } catch (error) {
                console.error(`Error fetching posts for user ${userId}:`, error.message);
            }
        }));

        if (type === "popular") {
            // Fetch comment counts
            const postCommentCounts = {};
            await Promise.all(allPosts.map(async (post) => {
                try {
                    const commentsResponse = await axios.get(`${COMMENTS_URL}/${post.id}/comments`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    postCommentCounts[post.id] = commentsResponse.data.comments.length || 0;
                } catch (error) {
                    console.error(`Error fetching comments for post ${post.id}:`, error.message);
                    postCommentCounts[post.id] = 0;
                }
            }));

            // Find max comment count
            const maxComments = Math.max(...Object.values(postCommentCounts));

            // Filter posts with max comment count
            const popularPosts = allPosts
                .map(post => ({
                    ...post,
                    commentCount: postCommentCounts[post.id] || 0,
                }))
                .filter(post => post.commentCount === maxComments);

            return res.status(200).json({ popularPosts });
        }

        if (type === "latest") {
            // Sort posts by creation timestamp (assuming `createdAt` exists)
            const latestPosts = allPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            return res.status(200).json({ latestPosts });
        }

        res.status(400).json({ error: "Invalid request" });

    } catch (error) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

export default router;
