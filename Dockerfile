FROM node:22-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Install dependencies (use --production to avoid installing devDependencies)
RUN pnpm install --production

# Copy the rest of the application files
COPY . .

# Expose the WebSocket server port (e.g., 8080)
EXPOSE 8080

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

# Run the Node.js WebSocket server
CMD ["node", "server.js"]
