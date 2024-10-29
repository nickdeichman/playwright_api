const { test, expect } = require('@playwright/test');
const nock = require('nock');
const errorMessages = require('../test-data/errorMessages');
const userId = 2;
const nonExistentUserId = 21551;

test.describe('delete user', () => {

  test.beforeEach(() => {
    nock.cleanAll();
  });

  test('should delete a user', async ({ request, baseURL }) => {
    try {
      const response = await request.delete(`${baseURL}/users/${userId}`);
      expect(response.status()).toBe(204);
    } catch (err) {
      console.error('Error during test of deleting user:', err);
      throw err;
    }
  });

  test.describe('Endpoint validation', () => {
    test('should return 404 on invalid user id endpoint', async ({
      request,
      baseURL,
    }) => {
      const incorrectUserIdData = ['invalidId', '', '!@$!@$!@$!@$'];

      for (const invalidId of incorrectUserIdData) {
        nock(baseURL).delete(`/users/${invalidId}`).reply(404, {
          error: errorMessages.invalidUserId,
        });
        try {
          const response = await request.delete(
            `${baseURL}/users/${invalidId}`
          );
          expect(response.status()).toBe(404);
        } catch (error) {
          console.error(
            'Error during negative case on incorrect user id endpoint test execution:',
            error
          );
          throw error;
        }
      }
    });

    test('should return 404 on non-existent user id', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL).delete(`/users/${nonExistentUserId}`).reply(404, {
        error: errorMessages.userDoesNotExist,
      });
      try {
        const response = await request.delete(
          `${baseURL}/users/${nonExistentUserId}`
        );
        expect(response.status()).toBe(404);
      } catch (error) {
        console.error(
          'Error during negative case on incorrect user id endpoint test execution:',
          error
        );
        throw error;
      }
    });

    test('should return 404 on request with body', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL)
        .delete(`/users/${nonExistentUserId}`, { test: 'test' })
        .reply(404, {
          error: errorMessages.excessBodyInRequest,
        });
      try {
        const response = await request.delete(
          `${baseURL}/users/${nonExistentUserId}`,
          { data: { test: 'test' } }
        );
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.excessBodyInRequest);
      } catch (error) {
        console.error(
          'Error during negative case on excess body in the delete request test execution:',
          error
        );
        throw error;
      }
    });

    test.afterEach(async () => {
      nock.cleanAll();
    });
  });
});
