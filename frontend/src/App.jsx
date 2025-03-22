import { useState, useEffect } from "react";
import "./styles.css"; // Importing the CSS file

function App() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setTopUsers(data.topUsers);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
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
        <h1 className="title">Top 5 Users</h1>

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
      </div>
    </div>
  );
}

export default App;
