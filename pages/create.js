"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

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
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in!");
      return;
    }

    let base64Image = null;
    if (image) {
      base64Image = await convertToBase64(image);
    }

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, image: base64Image }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Post created successfully!");
      setPosts([
        {
          postId: data.postId || Math.random().toString(),
          title,
          content,
          image: base64Image,
          authorName: username || "You",
          createdAt: new Date().toISOString(),
        },
        ...posts,
      ]);

      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
    } else {
      setMessage(`❌ Error: ${data.message || "Something went wrong"}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <h1>Create a Post</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "6px" }}
          />
        )}

        <button
          onClick={handleSubmit}
          style={{
            display: "block",
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Post
        </button>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

        <hr style={{ margin: "30px 0" }} />

        <h2>All Posts</h2>
        {posts.length === 0 && <p>No posts yet.</p>}

        {posts.map((post) => (
          <div key={post.postId} style={{ borderBottom: "1px solid #ddd", padding: "20px 0" }}>
            <h3>{post.title}</h3>
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
