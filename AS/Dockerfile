# Dockerfile to build the Express server

# Get the full node version (use alpine for a lighter version)
FROM node:14-alpine

# Set working directory to /app
WORKDIR /app

# Copy package.json into the container at /app
COPY package*.json /app/

# Install dependencies
RUN yarn install

# Copy the current directory contents into the container at /app
COPY . /app/

# Start the service
CMD [ "node", "index.js" ]
