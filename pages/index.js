"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/get");
      const data = await res.json();
      setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "20px auto", padding: "0 20px" }}>
        <h1>My Blog</h1>

        {posts.length === 0 && <p>No posts yet.</p>}

        {posts.map((post) => (
          <div key={post.postId} style={{ borderBottom: "1px solid #ddd", padding: "20px 0" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "6px" }}
              />
            )}
            <div style={{ marginTop: "8px", fontSize: "0.9em", color: "#555" }}>
              <span>By {post.authorName}</span> |{" "}
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
