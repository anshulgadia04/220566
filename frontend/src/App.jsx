import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Importing the CSS file

function App() {
  const [topUsers, setTopUsers] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // Default tab: users

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/users");
        setTopUsers(usersResponse.data.topUsers);

        const latestPostsResponse = await axios.get("http://localhost:3000/popular/top?type=latest");
        setLatestPosts(latestPostsResponse.data.latestPosts);

        const popularPostsResponse = await axios.get("http://localhost:3000/popular/top?type=popular");
        setPopularPosts(popularPostsResponse.data.popularPosts);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );

  return (
    <div className="app-container">
      <div className="content">
        <h1 className="title">
          {activeTab === "users"
            ? "Top 5 Users"
            : activeTab === "latestPosts"
            ? "Latest Posts"
            : "Popular Posts"}
        </h1>

        {/* Tab Buttons */}
        <div className="tabs">
          <button
            className={activeTab === "users" ? "active-tab" : ""}
            onClick={() => setActiveTab("users")}
          >
            Top Users
          </button>
          <button
            className={activeTab === "latestPosts" ? "active-tab" : ""}
            onClick={() => setActiveTab("latestPosts")}
          >
            Latest Posts
          </button>
          <button
            className={activeTab === "popularPosts" ? "active-tab" : ""}
            onClick={() => setActiveTab("popularPosts")}
          >
            Popular Posts
          </button>
        </div>

        {/* Top Users Tab */}
        {activeTab === "users" && (
          <div className="user-list">
            {topUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-id">User ID: {user.id}</p>
                </div>
                <span className="post-count">{user.postCount} Posts</span>
              </div>
            ))}
          </div>
        )}

        {/* Latest Posts Tab */}
        {activeTab === "latestPosts" && (
          <div className="post-list">
            {latestPosts.map((post) => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">Post ID: {post.id}</h2>
                <p className="post-content">{post.content}</p>
                <span className="post-user">User ID: {post.userid}</span>
              </div>
            ))}
          </div>
        )}

        {/* Popular Posts Tab */}
        {activeTab === "popularPosts" && (
          <div className="post-list">
            {popularPosts.map((post) => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">Post ID: {post.id}</h2>
                <p className="post-content">{post.content}</p>
                <span className="post-user">User ID: {post.userid}</span>
                <span className="comment-count">{post.commentCount} Comments</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
