# My MERN Stack Project - StudyBuddy

Welcome to the StudyBuddy project, an example MERN (MongoDB, Express, React, Node.js) application.

## Prerequisites

Before you start working with this project, make sure you have the following prerequisites in place:

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. (Node version 19.5.0)
- [MongoDB](https://www.mongodb.com/) installed and running.

## Troubleshooting
I ran into a problem with older node versions i recommend using 19.5.0

## Installation

Follow these steps to set up and run the project on your local machine:

1. Clone the repository:

    ```bash
    git clone https://github.com/DavidPalmgren/testapp/
    cd testapp
    ```

2. Install backend dependencies:

    ```bash
    npm install
    ```

3. Install frontend dependencies:

    ```bash
    cd studyapp/frontend/my-react-app
    npm install
    ```

4. Start the backend server. In the root directory (where `index.ejs` is located), run one of the following commands:

    - To run with Nodemon:
    
      ```bash
      nodemon
      ```

    - To run with Node.js:
    
      ```bash
      node index.ejs
      ```

5. Start the frontend React app. In the `my-react-app` directory:

    ```bash
    npm start
    ```

6. Environment Variables: Create an `.env` file in the `index.ejs` directory and add the following variables, which should have been provided to you:

    ```dotenv
    MONGO_URI=''
    PORT=4040
    JWT_SECRET=
    JWT_EXPIRES_IN=
    ```

If you have any questions or need assistance, please contact @davee3 on Discord or via email at swemultigamers@gmail.com.
