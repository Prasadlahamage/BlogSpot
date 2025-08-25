import AWS from "aws-sdk";

// Configure DynamoDB with your credentials & region
const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION, // must be in .env.local
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default dynamo;
