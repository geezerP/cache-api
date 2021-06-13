# cache-api
## Requirements

- MongoDB instance
- Node ~14 and above

## API installation and setup

1. Create a `.env` file in the root directory. .`.env-sample` file is provided for you at the root of the project: 

2. ```yarn install``` Install Dependencies
3. ```yarn build``` Build the API
4. ```yarn start:dev``` start the API in development mode
5. ```yarn start:prod``` start the API in production mode

# Postman collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/a0d9b31b30e3f8c58984)

## Supported routes

- `GET` api/cache/:id 
    - Retrieves the desired cachec entry or create a new one if not present 

- `GET` api/cache
    - Retrieves all entries in the cache

- `PUT` api/cache/:id | `{ value: 'New Value' }`
    - Replaces the value of a given entry

- `DELETE` api/cache/:id
    - Deletes a given entry from the cache

- `DELETE` api/cache
    - Deletes all entries in the cache


To run the test suitcase:

```bash

> ```yarn test```
```