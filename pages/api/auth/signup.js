import dynamo from "@/lib/dynamo";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await dynamo.put({
      TableName: "Users",
      Item: {
        userId,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      },
    }).promise();

    return res.status(201).json({ success: true, userId, username });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err.message });
  }
}
