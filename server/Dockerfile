# Dockerfile for production build of Ingredientory API

# Make sure to build the src before calling the docker-compose up
# TODO: use multi stage build that creates an intermediate image that installs dependencies in volume, then copies them over to the final image

FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Note: we copy over the package.json separately so that this layer's cache (installing the dependencies) 
#       will only be invalidated if either package.json or package-lock.json changes
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./
RUN yarn install --production && yarn cache clean

# Copy over the rest of the files (.dockerignore will do its thing)
COPY . .

EXPOSE 8080

CMD [ "node", "build/server.js" ]
