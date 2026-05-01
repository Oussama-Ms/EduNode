# Use the official Node.js 20 Alpine image for a small, secure base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
# We copy these FIRST to leverage Docker's caching mechanism.
# If dependencies haven't changed, Docker will use the cached layer for npm install.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 to the Docker network (matches our Express setup)
EXPOSE 5000

# We don't define the CMD here because docker-compose overrides it with 'npm run dev'
# for development. However, it's good practice to provide a default.
CMD ["npm", "start"]
