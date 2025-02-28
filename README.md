# NC News

## Environment Variables Setup

Since `.env.*` files are ignored by Git, anyone who clones this project won’t have access to the required environment variables.

To run this project locally, you need to create the necessary `.env` files in the root directory of the project.

### Steps to set up the environment variables:

1. Create a file named `.env.development` and add the following content:
   ```
   PGDATABASE=nc_news
   ```
2. Create a file named `.env.test` and add the following content:
   ```
   PGDATABASE=nc_news_test
   ```

These variables are required to connect to the respective databases for development and testing environments.

**Note:** Normally, sensitive information should not be posted in a README file. However, these instructions are provided to ensure you can set up and run this code if needed.

