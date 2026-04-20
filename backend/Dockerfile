# Use an official Node.js runtime as the base image
FROM node:22.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (update if your app use a different port)
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
