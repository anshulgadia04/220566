import express from "express";
import axios from "axios";
import { getAuthToken } from "../utils/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const USERS_URL = process.env.USERS_URL;


router.get("/", async (req, res) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(USERS_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

export default router;
