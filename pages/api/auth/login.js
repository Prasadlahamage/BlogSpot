import dynamo from "@/lib/dynamo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    console.log("📥 Login attempt:", username);

    const params = {
      TableName: "Users",
      FilterExpression: "username = :username",
      ExpressionAttributeValues: { ":username": username },
    };

    try {
      const data = await dynamo.scan(params).promise();
      console.log("🔍 DynamoDB returned:", data.Items);

      if (!data.Items || data.Items.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = data.Items[0];
      console.log("✅ Found user:", user);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("🔑 Password match:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET missing in env");
        return res.status(500).json({ message: "JWT secret not configured" });
      }

      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("🎉 Token generated");
      return res.status(200).json({ token });
    } catch (err) {
      console.error("💥 Login error:", err);
      res.status(500).json({ error: err.message });
    }
  }
}
