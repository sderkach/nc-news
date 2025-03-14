# NC News API

## Project Summary
NC News is a RESTful API that serves news articles, comments, topics, and user information. It allows users to interact with the data, including fetching articles, adding comments, voting on articles, and more. This API is designed to be used as the backend for a front-end news application.

## Hosted Version
A hosted version of the API is available here: **[NC News](https://nc-news-yimi.onrender.com)**

## Getting Started
To run this project locally, follow the steps below.

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: v16+
- **PostgreSQL**: v12+

### Installation & Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/sderkach/nc-news.git
   cd nc-news
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Since `.env` files are ignored by Git, you'll need to create them manually.
   - Create a file named `.env.development` and add:
     ```
     PGDATABASE=nc_news
     ```
   - Create a file named `.env.test` and add:
     ```
     PGDATABASE=nc_news_test
     ```

4. **Set up and seed the local database**:
   ```sh
   npm run setup-dbs
   npm run seed-dev
   ```

5. **Run tests**:
   ```sh
   npm test
   ```

6. **Start the server**:
   ```sh
   npm start
   ```
   The API will be running on `http://localhost:9090` by default.

## API Endpoints
For a full list of available endpoints and their usage, visit the `/api` endpoint in the running application or check the documentation file in this repository.

## Notes
- Normally, sensitive information like `.env` files should not be exposed publicly in a README file. However, these instructions are provided to ensure you can set up and run this code if needed.
- If any issues arise, ensure PostgreSQL is running and correctly set up.
