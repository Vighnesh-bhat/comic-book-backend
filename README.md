# Comic Book Backend API

This is a RESTful API for managing comic book inventory.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Database
- Postman for API Testing

## Setup

1. Clone the repository:
git clone https://github.com/Vighnesh-bhat/comic-book-backend.git

2. Install dependencies:
npm install express body-parser mysql2 express-validator dotenv

3. Set up environment variables:

Create a .env file in the root of the project.
Add the following variables (you can use .env.example as a reference):

DB_HOST=localhost
DB_USER=username
DB_PASSWORD=yourpassword
DB_NAME=comic_store

4. Run the project
npm start

## API Testing

1. Download and install [Postman](https://www.postman.com/).
2. Import the Postman collection from the `/postman/` folder of this repository.
3. Use the collection to test all the API endpoints.









