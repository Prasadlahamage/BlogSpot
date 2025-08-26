import AWS from "aws-sdk";

// Use default provider chain, picks up env vars automatically
AWS.config.update({
  region: process.env.AWS_REGION,
});

const dynamo = new AWS.DynamoDB.DocumentClient();
export default dynamo;
