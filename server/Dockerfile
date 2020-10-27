# Note: mongodb does not support alpine, so node:alpine will not work with mongod-memory-server
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Create directory for mongodb-memory-server
RUN mkdir node_modules/.cache/mongodb-memory-server/mongodb-instance

# Copy over the files (.dockerignore will do its thing)
COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]

