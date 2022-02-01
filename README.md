<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

I've started with a boilerplate of NestJS that I have used in production for several years now. [Boilerplate](https://github.com/clicdot/NODE-Fastify-NestJS-API-Boilerplate)

Unfortunately I don't get to update it much so it remains behind the boilerplate I use for work until I get a chance to sync it up and upate my repo with the latest code updates and npm package updates.

## Installation

```bash
$ yarn install
```

## Running the app

For the purposes of this exercise, I've included the `.env` file so its a lot easier to bootstrap the startup.

### ENV Variables
> Need __*.env*__ file for the __*docker-compose*__ file
>
> Create a .env file for dev or prod
>
> Add the following variables
>
> ```bash
> dFile='Dockerfile.dev'
> NODE_ENV='DEV'
> ENV='DEV'
> appName='test'
> PORT_MAPPED=3000
> PORT_TARGET=8080
> NODE_WORKERS=auto
> ...
> ```
>
> .

```bash
# development
$ yarn start

# log mode
$ yarn logs:api

# seed account data
$ yarn start:dev:db:seed
```

`yarn start` begins the build process. Everything is run inside a docker container which spins up a mongodb and postgres db. The configuration can be found in `docker-compose.yml`.

After the build process, running `yarn logs:api` will expose the api logs so you an see the logs. After the build process, it takes a min for the nestjs to start so running logs will let you know when the API is ready to be polled.

## Support

### Swagger

When the app is running, you can go to

```
http://localhost:4030/swagger/
```

I've also included a [swagger.json](swagger/swagger.json) file.

### Postman

I've added a postman and env file for testing. [Postman](postman/Banking.postman_collection.json) & [Postman Env](postman/banking.postman_environment.json)

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
