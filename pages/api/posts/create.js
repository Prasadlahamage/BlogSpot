"use client";

import { useState, useEffect } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  // Fetch posts
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
  }, []);

  // Image preview
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

  // Submit post
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
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Create a Post</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className={styles.textarea}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />

        {preview && (
          <img src={preview} alt="Preview" className={styles.imagePreview} />
        )}

        <button onClick={handleSubmit} className={styles.submitButton}>
          Create Post
        </button>

        {message && <p className={styles.message}>{message}</p>}

        <hr className={styles.divider} />

        <h2>All Posts</h2>
        {posts.length === 0 && <p>No posts yet.</p>}

        {posts.map((post) => (
          <div key={post.postId} className={styles.postCard}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                className={styles.postImage}
              />
            )}
            <div className={styles.postMeta}>
              <span>By {post.authorName}</span> |{" "}
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
