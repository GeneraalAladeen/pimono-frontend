# pimono-wallet-frontend

This is the front end for the pimono wallet built for a technical test. The application is built in Vue3 using composition Api. It uses Pinia for state management and laravel echo and pusher for real time updates.


## Project Setup

Make sure the latest version of node is available on system. i.e (node v24). To install Node visit `https://nodejs.org/en/download`. 

Install dependencies

```sh
yarn
```

Setup env

```sh
cp .env.example .env
```

Make sure the backend is running on the same machine and set `VITE_BACKEND_BASE_URL` to the backend url, ideally `http://localhost/`


Configure pusher env. For the sake of the test i have provided mine but feel free to use yours. `NOTE: Make sure it is the same as the one used on the backend`. 

```sh
  VITE_PUSHER_APP_KEY=b5c957260fd11205fc84
  VITE_PUSHER_APP_CLUSTER=eu
```

### To Start application

```sh
yarn dev
```

### User Credentials

Users have been seeded into the backend already. To Log in. Use any of these email

```sh
user1@example.com
user2@example.com
user2@example.com
```

the password for all of them is 

```sh
  password
```
