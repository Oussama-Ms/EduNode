# Use Node.js 20 Alpine for the frontend as well
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json first for optimal caching
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose port 5173 which is Vite's default port
EXPOSE 5173

# The dev command is overridden in docker-compose.yml, but this is a sensible fallback.
CMD ["npm", "run", "dev", "--", "--host"]
