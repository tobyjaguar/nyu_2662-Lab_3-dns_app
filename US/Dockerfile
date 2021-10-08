# Dockerfile to build the Express server

# Get the full node version (use alpine for a lighter version)
FROM node:14-alpine

# Set working directory to /api
WORKDIR /api

# Copy package.json into the container at /api
COPY package*.json /api/

# Install dependencies
RUN yarn install

# Copy the current directory contents into the container at /api
COPY . /api/

# Start the service
CMD [ "node", "index.js" ]
