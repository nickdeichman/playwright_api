const { test, expect } = require('@playwright/test');
const {
  listOfUsersOnSecondPage,
  userById,
  resultOnUnknown,
  resultOnUnknownWithId,
} = require('../test-data/expectedResultsGet');

const invalidData = ['invalidData', '', '!@#$%@!%'];

test.describe('get users', () => {
  test('should return a list of users by page number', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/users?page=2`);
      expect(response.status()).toBe(200);
      const users = await response.json();
      expect(users).toStrictEqual(listOfUsersOnSecondPage);
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return the user by id', async ({ request, baseURL }) => {
    try {
      const response = await request.get(`${baseURL}/users/2`);
      expect(response.status()).toBe(200);
      const user = await response.json();
      expect(user).toStrictEqual(userById);
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return code 200 and empty data for non-existent page', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/users?page=999999`);
      expect(response.status()).toBe(200); // Note: Current API returns 200 instead of 404
      const body = await response.json();
      expect(body.data).toStrictEqual([]); // Check that the data array is empty
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return page 1 on unknown endpoint', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/unknown`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toStrictEqual(resultOnUnknown);
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return data object on unknown endpoint with id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/unknown/2`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toStrictEqual(resultOnUnknownWithId);
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return page 1 data when an invalid page number is provided', async ({
    request,
    baseURL,
  }) => {
    for (const data of invalidData) {
      const response = await request.get(`${baseURL}/users?page=${data}`);
      expect(response.status()).toBe(200); // Expect 200 since the API defaults to page 1
      const users = await response.json();
      // Verify the response is the same as expected for page 1
      expect(users.page).toBe(1);
      expect(users.data).toHaveLength(6); // Assuming 6 users per page as shown in your response
    }
  });

  test('should return code 404 on string instead of number id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/users/invalidId`);
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toStrictEqual({});
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return code 404 on special characters instead of number id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/users/!@#$@!$!@`);
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toStrictEqual({});
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return 404 on unknown endpoint with non-existent id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/unknown/24`);
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toStrictEqual({});
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return 404 on unknown endpoint with special symbols instead of number id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/unknown/!@!#`);
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toStrictEqual({});
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test('should return 404 on unknown endpoint with string instead of number id', async ({
    request,
    baseURL,
  }) => {
    try {
      const response = await request.get(`${baseURL}/unknown/invalidId`);
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body).toStrictEqual({});
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });
});
