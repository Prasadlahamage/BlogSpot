# Step 1: Use official Node.js image (small Alpine version)
FROM node:18-alpine AS base

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --legacy-peer-deps

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build the Next.js project (creates .next folder)
RUN npm run build

# Step 7: Expose port 3000 (Next.js default)
EXPOSE 3000

# Step 8: Start Next.js in production mode
CMD ["npm", "start"]
