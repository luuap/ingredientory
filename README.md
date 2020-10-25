# Ingredientory

## Project Description

- Typescript
- Sass

## VSCode extensions

- dsznajder.es7-react-js-snippets
- dbaeumer.vscode-eslint
- ms-vscode.atom-keybindings

## Prerequisites

- Node.js v12.19.0 
- yarn v1.22.5

## Install dependencies
```sh
yarn install
```

## Starting the app

Both in server and client directories:

```sh
yarn start
```

- Client is running on localhost:3000
- Server is running on localhost:8080


## Local REST server
- Go to <http://localhost:8080/ingredients?query=escargot> to test the server
- For multiple queries, separate parameters by a semi-colon <http://localhost:8080/ingredients?query=beef;carrot>
- Available ingredients on test server: 
`['apple', 'beef', 'carrots', 'duck', 'escargot', 'fudge', 'grapes', 'ham', 'ice cream', 'jalapenos', 'kale', 'linguine', 'mozzarella cheese', 'nutmeg', 'octopus', 'pineapple', 'quail', 'radish', 'salmon', 'tiger shrimp', 'udon noodles', 'vodka', 'whiskey', 'xanthan gum', 'yam', 'zucchini']`
- If first time running server, it will download mongodb binaries, which is about 250mb

## Building the client app

```sh
yarn build
```

## Attributions

Dataset from [Shuyang Li](https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions)