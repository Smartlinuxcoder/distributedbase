# API Documentation

## Register Site

Registers a new site with its associated password.

- **URL**

  `/api/site/register`

- **Method**

  `POST`

- **Data Params**

  | Parameter | Type   | Description              |
  |-----------|--------|--------------------------|
  | `site`    | string | Name of the site         |
  | `password`| string | Password for the site    |

- **Success Response**

  - **Code:** 201 CREATED
    **Content:** "Site registered successfully"

- **Error Responses**

  - **Code:** 400 BAD REQUEST
    **Content:** "Site already exists"

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error registering site"


## User Registration

Registers a new user with its associated username and password.

- **URL**

  `/api/user/register`

- **Method**

  `POST`

- **Data Params**

  | Parameter | Type   | Description              |
  |-----------|--------|--------------------------|
  | `username`| string | User's username          |
  | `password`| string | User's password          |

- **Success Response**

  - **Code:** 201 CREATED
    **Content:** "User registered successfully"

- **Error Responses**

  - **Code:** 400 BAD REQUEST
    **Content:** "Username already exists"

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error registering user"


## User Login

Authenticates a user and generates a session token.

- **URL**

  `/api/user/login`

- **Method**

  `POST`

- **Data Params**

  | Parameter | Type   | Description                |
  |-----------|--------|----------------------------|
  | `username`| string | User's username            |
  | `password`| string | User's password            |
  | `site`    | string | Name of the site           |

- **Success Response**

  - **Code:** 200 OK
    **Content:** JSON object with session token:
    ```json
    {
      "hash": "SESSION_TOKEN_HASH"
    }
    ```

- **Error Responses**

  - **Code:** 400 BAD REQUEST
    **Content:** "Invalid username or password"

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error logging in"


## Site Login

Authenticates a site and generates a JWT token.

- **URL**

  `/api/site/login`

- **Method**

  `POST`

- **Data Params**

  | Parameter | Type   | Description                |
  |-----------|--------|----------------------------|
  | `site`    | string | Site's name                |
  | `password`| string | Site's password            |

- **Success Response**

  - **Code:** 200 OK
    **Content:** JSON object with JWT token:
    ```json
    {
      "token": "JWT_TOKEN"
    }
    ```

- **Error Responses**

  - **Code:** 400 BAD REQUEST
    **Content:** "Invalid site or password"

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error logging in"


## Secure Access

Authenticates a site and grants access based on the provided session token. (This contains the site's jwt token)

- **URL**

  `/api/site/secureaccess`

- **Method**

  `POST`

- **Data Params**

  | Parameter     | Type   | Description                     |
  |---------------|--------|---------------------------------|
  | `site`        | string | Name of the site                |
  | `password`    | string | Password for the site           |
  | `sessiontoken`| string | Session token received from user|

- **Success Response**

  - **Code:** 200 OK
    **Content:** JSON object with username:
    ```json
    {
      "username": "USER_NAME"
    }
    ```

- **Error Responses**

  - **Code:** 400 BAD REQUEST
    **Content:** "Invalid site, password, or session token"

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error logging in"

## Update JSON Data / As an user

Writes data for a specific website to a JSON file. (suitable to be used on the client)

- **URL**

  `/api/db/writeJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter     | Type   | Description                     |
  |---------------|--------|---------------------------------|
  | `sessiontoken`| string | Session token received from user|
  | `website`     | string | Name of the website             |
  | `data`        | object | Data to be updated to JSON file |

- **Success Response**

  - **Code:** 200 OK
    **Content:** "Data written to USERNAME.json under WEBSITE successfully"

- **Error Responses**

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error writing to JSON file"

## Update JSON Data / As the server

Updates data for a specific website to the db.

- **URL**

  `/api/db/writeJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter             | Type   | Description                     |
  |-----------------------|--------|---------------------------------|
  | `website`             | string | Website name                    |
  | `websitepassword`     | string | Website password                |
  | `data`                | object | Data to be updated to JSON file |
  | `privileges`          | object | Data privilege access level*    |

- **Success Response**

  - **Code:** 200 OK
    **Content:** "Data written to USERNAME.json under WEBSITE successfully"

- **Error Responses**

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error writing to JSON file"

## Write JSON Data / As an user

Writes data for a specific website to a JSON file. (suitable to be used on the client)

- **URL**

  `/api/db/writeJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter     | Type   | Description                     |
  |---------------|--------|---------------------------------|
  | `sessiontoken`| string | Session token received from user|
  | `website`     | string | Name of the website             |
  | `data`        | object | Data to be written to JSON file |

- **Success Response**

  - **Code:** 200 OK
    **Content:** "Data written to USERNAME.json under WEBSITE successfully"

- **Error Responses**

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error writing to JSON file"

## Write JSON Data / As the server

Writes data for a specific website to the db.

- **URL**

  `/api/db/writeJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter             | Type   | Description                     |
  |-----------------------|--------|---------------------------------|
  | `website`             | string | Website name                    |
  | `websitepassword`     | string | Website password                |
  | `data`                | object | Data to be written to JSON file |
  | `privileges`          | object | Data privilege access level*    |

- **Success Response**

  - **Code:** 200 OK
    **Content:** "Data written to USERNAME.json under WEBSITE successfully"

- **Error Responses**

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error writing to JSON file"


## Read JSON Data / As an user

Reads data for a specific website from a JSON file.(suitable to be used on the client).
Gives rw and ro priviledge level data*

- **URL**

  `/api/db/readJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter     | Type   | Description                     |
  |---------------|--------|---------------------------------|
  | `sessiontoken`| string | Session token received from user|
  | `website`     | string | Name of the website             |

- **Success Response**

  - **Code:** 200 OK
    **Content:** JSON object with website data

- **Error Responses**

  - **Code:** 404 NOT FOUND
    **Content:** "Website data not found"

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error reading JSON file"

## Read JSON Data / As the server

Reads data for a specific website from a JSON file.(suitable to be used on the client).

- **URL**

  `/api/db/readJson`

- **Method**

  `POST`

- **Data Params**

  | Parameter             | Type   | Description                     |
  |-----------------------|--------|---------------------------------|
  | `website`             | string | Website name                    |
  | `websitepassword`     | string | Website password                |
  | `privileges`          | object | Data privilege access level*    |

- **Success Response**

  - **Code:** 200 OK
    **Content:** JSON object with website data

- **Error Responses**

  - **Code:** 404 NOT FOUND
    **Content:** "Website data not found"

  - **Code:** 403 FORBIDDEN
    **Content:** "Access denied. Invalid token."

  - **Code:** 500 INTERNAL SERVER ERROR
    **Content:** "Error reading JSON file"


# Data access level
    You have 3 levels of data privileges:
    - *rw* normal data privilege for client-side code / client and server can read and write
    - *ro* Only the server is allowed to write here / client can read but has no write access
    - *root* Only the server is allowed to read and write / unaccessible to the client

    The read/write setting has to be passed in the body, when trying to write/read from the db.


## Example Usage

//TODO add example usage