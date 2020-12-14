# Ingredientory

## Project Description

[Project Link](ingredientory.web.app)

### Front-end
- React in Typescript and Sass, using create-react-app

### Back-end
- AWS Gateway API, AWS Lambda using container images, and MongoDB Atlas

## VSCode extensions

- dsznajder.es7-react-js-snippets
- dbaeumer.vscode-eslint
- ms-vscode.atom-keybindings
- ms-azuretools.vscode-docker

## Prerequisites

- Node.js v14.15.0 
- Yarn v1.22.5
- (Optional) Docker Desktop

## Install dependencies

In root project directory:

```sh
yarn install
```

## Starting the app (in development mode)

`cd` to server and client directories in separate terminals:

First run the server and then the client.

```sh
yarn dev
```

- Server is running on localhost:8080
- Client is running on localhost:3000


## Local REST server
- Go to <http://localhost:8080/ingredients?query=escargot> to test the server
- For multiple queries, separate parameters by a semi-colon <http://localhost:8080/ingredients?query=beef;carrots>
- Available ingredients on test server: 
`['apple', 'beef', 'carrots', 'duck', 'escargot', 'fudge', 'grapes', 'ham', 'ice cream', 'jalapenos', 'kale', 'linguine', 'mozzarella cheese', 'nutmeg', 'octopus', 'pineapple', 'quail', 'radish', 'salmon', 'tiger shrimp', 'udon noodles', 'vodka', 'whiskey', 'xanthan gum', 'yam', 'zucchini']`
- If first time running server, it will download mongodb binaries in node_modules/.cache, which is about 250mb
- Install [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) chrome extension for more readable results

## Building the client app

```sh
yarn build
```

## Running the docker containers for API and mongodb
- `cd` to server/
- run `yarn stage`

## Required .env files with their fields for client
- `.env.production` with `REACT_APP_API_URI`

## Required .env files with their fields for server
- `.env.production` with `STAGE_USERNAME` and `STAGE_PASSWORD`
- `.env` with `MONGO_URI`

## Attributions

Dataset from [Shuyang Li](https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions)