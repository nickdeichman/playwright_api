const { test, expect } = require('@playwright/test');
const nock = require('nock');
import errorMessages from '../test-data/errorMessages';

const newUserData = {
  name: 'morpheus',
  job: 'leader',
};

const invalidFieldData = ['Name123', '', '     ', 'Name!@#'];


test.describe('create user', () => {
  test.beforeEach(() => {
    nock.cleanAll();
  });

  test('should return a new user', async ({ request, baseURL }) => {
    try {
      const response = await request.post(`${baseURL}/users`, newUserData);
      expect(response.status()).toBe(201);
      const body = await response.json();
      /* That is how it should be working but current API doesn't support it.
      const getResponse = await request.get(`${baseURL}/users/${body.id}`);
      expect(getResponse.status()).toEqual(200);
      const newUser = await getResponse.json();
      expect(newUser).toEqual(expect.objectContaining(newUserData));
      */
    } catch (error) {
      console.error('Error during test execution:', error);
      throw error;
    }
  });

  test.describe('Name field validation', () => {
    test('should return 400 error for user name longer than 30 characters', async ({
      request,
      baseURL,
    }) => {
      const longNames = [
        'a'.repeat(31), // edge case
        'a'.repeat(32), // just over limit
        'a'.repeat(52), // significantly over limit
      ];

      for (const name of longNames) {
        nock(baseURL).post('/users', { name, job: 'test' }).reply(400, {
          error: errorMessages.longNameLength,
        });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: { name, job: 'test' },
          });
          expect(response.status()).toBe(400);
          const body = await response.json();
          expect(body.error).toBe(errorMessages.longNameLength);
        } catch (error) {
          console.error(
            'Error during negative case on long name field test execution:',
            error
          );
          throw error;
        }
      }
    });

    test('should return code 201 when user name length in correct edge values', async ({
      request,
      baseURL,
    }) => {
      const edgeCaseNames = [
        'a'.repeat(3),
        'a'.repeat(4),
        'a'.repeat(29),
        'a'.repeat(30),
      ];

      for (const name of edgeCaseNames) {
        nock(baseURL)
          .post('/users', {
            name,
            job: 'jobValue',
          })
          .reply(201, {
            name,
            job: 'jobValue',
            id: '361',
            createdAt: '2024-10-29T17:25:51.892Z',
          });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: {
              name,
              job: 'jobValue',
            },
          });
          expect(response.status()).toBe(201);
          const body = await response.json();
          expect(body).toEqual(
            expect.objectContaining({ name, job: 'jobValue' })
          );
        } catch (error) {
          console.error('Error during negative case test execution:', error);
          throw error;
        }
      }
    });

    test('should return code 400 when user name length = 2', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL)
        .post('/users', {
          name: 'aa',
          job: 'test',
        })
        .reply(400, {
          error: errorMessages.shortNameLength,
        });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: {
            name: 'aa',
            job: 'test',
          },
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.shortNameLength);
      } catch (error) {
        console.error(
          'Error during negative case on short name field test execution:',
          error
        );
        throw error;
      }
    });

    test('should return 400 error when name is missing', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL).post('/users', { job: 'test' }).reply(400, {
        error: errorMessages.missingNameField,
      });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: { job: 'test' },
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.missingNameField);
      } catch (error) {
        console.error(
          'Error during negative case on missing name field test execution:',
          error
        );
        throw error;
      }
    });

    test('should return 400 error when the provided name contains prohibited characters', async ({
      request,
      baseURL,
    }) => {
      for (const name of invalidFieldData) {
        nock(baseURL).post('/users', { name, job: 'test' }).reply(400, {
          error: errorMessages.nameFieldWithProhibitedCharacters,
        });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: {
              name,
              job: 'test',
            },
          });
          expect(response.status()).toBe(400);
          const body = await response.json();
          expect(body.error).toBe(
            errorMessages.nameFieldWithProhibitedCharacters
          );
        } catch (error) {
          console.error(
            'Error during negative case on non-latin characters in name field test execution:',
            error
          );
          throw error;
        }
      }
    });
  });

  test.describe('The job field validation', () => {
    test('should return 400 error for user job longer than 15 characters', async ({
      request,
      baseURL,
    }) => {
      const longJobs = [
        'a'.repeat(16), // edge case
        'a'.repeat(17), // just over limit
        'a'.repeat(32), // significantly over limit
      ];

      for (const job of longJobs) {
        nock(baseURL).post('/users', { name: 'TestName', job }).reply(400, {
          error: errorMessages.longJobField,
        });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: { name: 'TestName', job },
          });
          expect(response.status()).toBe(400);
          const body = await response.json();
          expect(body.error).toBe(errorMessages.longJobField);
        } catch (error) {
          console.error(
            'Error during negative case on long job field test execution:',
            error
          );
          throw error;
        }
      }
    });

    test('should return code 201 when user job length in correct edge values', async ({
      request,
      baseURL,
    }) => {
      const edgeCaseJobs = [
        'a'.repeat(3),
        'a'.repeat(4),
        'a'.repeat(14),
        'a'.repeat(15),
      ];

      for (const job of edgeCaseJobs) {
        nock(baseURL)
          .post('/users', {
            name: 'TestName',
            job,
          })
          .reply(201, {
            name: 'TestName',
            job,
            id: '361',
            createdAt: '2024-10-29T17:25:51.892Z',
          });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: {
              name: 'TestName',
              job,
            },
          });
          expect(response.status()).toBe(201);
          const body = await response.json();
          expect(body).toEqual(
            expect.objectContaining({ name: 'TestName', job })
          );
        } catch (error) {
          console.error('Error during negative case test execution:', error);
          throw error;
        }
      }
    });

    test('should return code 400 when user job length = 2', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL)
        .post('/users', {
          name: 'TestName',
          job: 'aa',
        })
        .reply(400, {
          error: errorMessages.shortJobField,
        });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: {
            name: 'TestName',
            job: 'aa',
          },
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.shortJobField);
      } catch (error) {
        console.error(
          'Error during negative case on short job field test execution:',
          error
        );
        throw error;
      }
    });

    test('should return 400 error when the provided job contains prohibited characters', async ({
      request,
      baseURL,
    }) => {
      for (const job of invalidFieldData) {
        nock(baseURL).post('/users', { name: 'TestName', job }).reply(400, {
          error: errorMessages.jobFieldWithProhibitedCharacters,
        });
        try {
          const response = await request.post(`${baseURL}/users`, {
            data: {
              name: 'TestName',
              job,
            },
          });
          expect(response.status()).toBe(400);
          const body = await response.json();
          expect(body.error).toBe(
            errorMessages.jobFieldWithProhibitedCharacters
          );
        } catch (error) {
          console.error(
            'Error during negative case on non-Latin characters in the job field test execution:',
            error
          );
          throw error;
        }
      }
    });

    test('should return 400 error when job key is missing', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL).post('/users', { name: 'test' }).reply(400, {
        error: errorMessages.missingJobField,
      });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: { name: 'test' },
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.missingJobField);
      } catch (error) {
        console.error(
          'Error during negative case on missing job key test execution:',
          error
        );
        throw error;
      }
    });
  });

  test.describe('The request body validation', () => {
    test('should return 400 error when request body is missing', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL).post('/users', {}).reply(400, {
        error: errorMessages.missingResponseBody,
      });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: {},
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.missingResponseBody);
      } catch (error) {
        console.error(
          'Error during negative case on the missing body test execution:',
          error
        );
        throw error;
      }
    });

    test('should return 400 error when request body is not in JSON format', async ({
      request,
      baseURL,
    }) => {
      nock(baseURL).post('/users', 'Test').reply(400, {
        error: errorMessages.bodyInNotJson,
      });
      try {
        const response = await request.post(`${baseURL}/users`, {
          data: 'Test',
          headers: { 'Content-Type': 'text/plain' },
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe(errorMessages.bodyInNotJson);
      } catch (error) {
        console.error(
          'Error during negative case on the incorrect format of the body test execution:',
          error
        );
        throw error;
      }
    });
  });

  test.afterEach(async () => {
    nock.cleanAll();
  });
});
