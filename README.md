# Playwright API Testing

This repository contains a suite of tests using Playwright for API testing, focusing on user management functionalities including creating, updating, retrieving, and deleting users.

## Grateful for the REST application to

### [Reqres](https://reqres.in/#support-heading)

## Directory Structure

- **tests/**: Contains test files for user-related API endpoints.
  - **get-user.spec.js**: Tests for retrieving user data via GET requests.
  - **create-user.spec.js**: Tests for creating a new user with field validation.
  - **update-user.spec.js**: Tests for updating user details with validation.
  - **delete-user.spec.js**: Tests for deleting a user.

- **errorMessages.js**: Defines standard error messages used across tests.
- **expectedResultsGet.js**: Contains expected results for user retrieval tests.
- **package.json**: Lists dependencies, including Playwright and Nock.

## Technologies

- **JavaScript**: The programming language used for writing the tests.
- **Playwright**: A Node.js library for browser automation, utilized for API testing in this project.
- **Nock**: A HTTP mocking library for Node.js, used to intercept and simulate HTTP requests and responses.

## Testing Scenarios

### get-user.spec.js

- Validates successful retrieval of user data with various scenarios including valid and invalid user IDs and page numbers.

### create-user.spec.js

- Tests the creation of new users with a focus on validation for name and job fields.
- Covers both successful and erroneous cases to ensure comprehensive validation.

### update-user.spec.js

- Validates the update functionality with checks for name field constraints and overall request body validation.

### delete-user.spec.js

- Tests the deletion of users and verifies the appropriate handling of valid and invalid user IDs.

## Running the Tests

To run the tests, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/nickdeichman/playwright_api.git
   cd playwright_api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the tests:

   ```bash
   npx playwright test
   ```
