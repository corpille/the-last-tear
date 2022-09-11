# Development

## Requirements

Install [nvm](https://github.com/nvm-sh/nvm) with these commands :

```sh
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
```

Then install Node 16 using this commande

```sh
nvm install 16
```

Finally install [yarn](https://yarnpkg.com/) using this command :

```sh
npm install -g yarn
```

## Install

To install the dependencies of the project use this command:

```sh
yarn install
```

## Dev

Launch the live server using this command :

```sh
yarn dev
```

## Build

Builmd the app using this command, the result will be in the `dist` folder :

```sh
yarn build
```
