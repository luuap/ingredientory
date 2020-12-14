# Dockerfile for production build of Ingredientory API

# Make sure to build the src before calling the docker-compose up

FROM node:14-alpine AS stage

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

CMD [ "node", "build/start-api-server.js" ]


# Production image for AWS Lambda container deployment
# Note:  

FROM amazon/aws-lambda-nodejs:12

COPY --from=stage /usr/src/app/node_modules /var/task/node_modules
COPY --from=stage /usr/src/app/build /var/task/build

CMD [ "build/lambda.handler" ] 
