"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
      <Link href="/" style={{ marginRight: "20px" }}>Home</Link>

      {username ? (
        <>
          <span style={{ marginRight: "20px" }}>Logged in as: {username}</span>
          <Link href="/create" style={{ marginRight: "20px" }}>Create Post</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/signup" style={{ marginRight: "20px" }}>Signup</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
