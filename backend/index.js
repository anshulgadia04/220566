import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;


app.get("/" , (req,res)=>{
    res.send("Welcome to Social Media App");
});


app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);

app.listen(PORT , () => {
    console.log(`Server is Running on http://localhost:${PORT}`);
    
})