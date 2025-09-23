import dynamo from "@/lib/dynamo";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postId } = req.body; // ID of the post to delete
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Optionally: check if the logged-in user is the author
    const getParams = {
      TableName: "Blogs",
      Key: { postId },
    };

    const data = await dynamo.get(getParams).promise();

    if (!data.Item) return res.status(404).json({ message: "Post not found" });

    if (data.Item.authorId !== decoded.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete the post
    const deleteParams = {
      TableName: "Blogs",
      Key: { postId },
    };

    await dynamo.delete(deleteParams).promise();

    return res.status(200).json({ success: true, message: "Post deleted!" });
  } catch (err) {
    console.error("❌ Delete post error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
