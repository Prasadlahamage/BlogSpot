import dynamo from "@/lib/dynamo";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = await dynamo.scan({ TableName: "Blogs" }).promise();
    const items = (data.Items || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
