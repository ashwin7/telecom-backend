const request = require('supertest');  // Supertest for making HTTP requests to the server
const app = require('../app'); // Replace with actual app file path

test('registers a new customer with valid data', async () => {
  const newCustomer = {
    name: 'Test User',
    dob: '2000-01-01',
    email: 'test@example.com',
    id: '123456',
    registrationDate: '2024-05-13',
  };

  const response = await request(app)
    .post('/customers')
    .send(newCustomer)
    .expect(201); // Expect created status code

  expect(response.body).toHaveProperty('name', newCustomer.name);
  expect(response.body).toHaveProperty('mobileNumber'); // Check for generated number
});

test('returns error for missing required fields', async () => {
  const incompleteCustomer = {
    name: 'Test User',
    email: 'test@example.com',
  };

  const response = await request(app)
    .post('/customers')
    .send(incompleteCustomer)
    .expect(400); // Expect bad request status code

  expect(response.body).toHaveProperty('message', 'Missing required fields');
});