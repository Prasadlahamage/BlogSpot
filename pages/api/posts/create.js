import dynamo from "@/lib/dynamo";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, content, image } = req.body; // Add image

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const params = {
        TableName: "Blogs",
        Item: {
          postId: uuidv4(),
          title,
          content,
          image: image || null,          // Save image if provided
          authorId: decoded.userId,
          authorName: decoded.username,
          createdAt: new Date().toISOString(),
        },
      };

      await dynamo.put(params).promise();
      res.status(201).json({ success: true, message: "Blog created!" });
    } catch (err) {
      console.error("Create blog error:", err);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
