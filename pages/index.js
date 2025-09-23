"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.js";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/get");
      const data = await res.json();
      setPosts(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
    }
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getSnippet = (content) => {
    const words = content.split(" ");
    if (words.length <= 20) return content;
    return words.slice(0, 20).join(" ") + "...";
  };

  const handleDelete = async (postId) => {
    if (!token) return alert("You must be logged in to delete a post.");
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Post deleted successfully!");
        setPosts(posts.filter((post) => post.postId !== postId));
      } else {
        alert(data.message || "Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Adventures & Ideas</h1>

        {posts.length === 0 && (
          <p style={{ textAlign: "center", color: "#555" }}>No posts yet.</p>
        )}

        {posts.map((post) => (
          <div key={post.postId} className={styles.postCard}>
            <h2>{post.title}</h2>

            <p className={styles.postContent}>
              {expandedPosts[post.postId]
                ? post.content
                : getSnippet(post.content)}
            </p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post image"
                className={styles.postImage}
              />
            )}

            <div className={styles.postMeta}>
              <span>By {post.authorName}</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>

            <div className={styles.postActions}>
              <button
                onClick={() => toggleReadMore(post.postId)}
                className={styles.readMore}
              >
                {expandedPosts[post.postId] ? "Read Less ←" : "Read More →"}
              </button>

              {username && username === post.authorName && (
  <button
    onClick={() => handleDelete(post.postId)}
    className={styles.deleteButton} 
  >
    Delete
  </button>
)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
