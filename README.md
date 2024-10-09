# Arabic Vocabulary Builder Backend

This is the backend for the Arabic Vocabulary Builder application. It provides APIs for managing users, words, and other related functionalities.

## Project Structure
env .env.test .gitignore coverage/ arabic-vocabulary-builder-backend/.html ... base.css block-navigation.js index.html prettify.css prettify.js sorter.js src/ controllers/ db/ middlewares/ models/ routes/ services/ utils.js test/ user.test.js word.test.js index.js mnt/ data/ package.json 


## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd arabic-vocabulary-builder-backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Configuration

Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.test` file as a reference.

### Running the Application

To start the application, run:
```sh
npm start
```
Running Tests
To run the tests, use:
npm test
### Project Structure

- **src/** - Contains the source code of the application.
    - **controllers/** - Contains the controllers for handling HTTP requests.
    - **db/** - Contains database-related files.
    - **middlewares/** - Contains middleware functions.
    - **models/** - Contains the database models.
    - **routes/** - Contains the route definitions.
    - **services/** - Contains the business logic.
    - **utils.js** - Contains utility functions.
- **test/** - Contains the test files.
    - **user.test.js** - Tests for user-related functionalities.
    - **word.test.js** - Tests for word-related functionalities.
- **coverage/** - Contains the code coverage reports.
- **mnt/** - Contains mount points for data.
- **package.json** - Contains the project metadata and dependencies.

### License

This project is licensed under the MIT License. All rights reserved to Nasmin Uddin.
