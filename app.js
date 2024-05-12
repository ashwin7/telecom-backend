const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors library

const app = express();
const port = 4000;

// In-memory storage (replace with database for production)
let customers = {0:{name:"Dummy", dob: "2024-05-08", email: "a@a.in", id: "123", registrationDate: "2024-05-08", mobileNumber: "1234567898", plan: null}};
let nextCustomerId = 1;

app.use(cors({ // Enable CORS for all origins (adjust for production)
    origin: 'http://localhost:3000' // Allow requests from React app on port 3000
  }));
app.use(bodyParser.json());

// Function to generate a 10-digit random mobile number
function generateMobileNumber() {
  let number = '9';
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

// Function to add a new customer
function addCustomer(name, dob, email, id, registrationDate) {
  const mobileNumber = generateMobileNumber();
  const customerId = nextCustomerId++;
  customers[customerId] = {
    name,
    dob,
    email,
    id,
    registrationDate,
    mobileNumber,
    plan: null,
  };
  return customers[customerId];
}

// Function to get all customers
function getAllCustomers() {
  return Object.values(customers);
}

// Function to get a customer by ID
function getCustomerById(id) {
  return customers[id];
}

// Function to define a telecom plan
function TelecomPlan(name, cost, validity, status) {
  this.name = name;
  this.cost = cost;
  this.validity = validity;
  this.status = status;
}

// Define available plans (replace with actual plan details)
const plans = {
  Platinum365: new TelecomPlan('Platinum365', 499, 365, 'Active'),
  Gold180: new TelecomPlan('Gold180', 299, 180, 'Active'),
  Silver90: new TelecomPlan('Silver90', 199, 90, 'Active'),
};

// Function to assign a plan to a customer
function assignPlan(customerId, planName) {
  const customer = getCustomerById(customerId);
  if (customer && plans[planName]) {
    customer.plan = plans[planName];
    return customer;
  }
  return null;
}

// Route to register a new customer
app.post('/customers', (req, res) => {
  const { name, dob, email, id, registrationDate } = req.body;
  if (!name || !dob || !email || !id || !registrationDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newCustomer = addCustomer(name, dob, email, id, registrationDate);
  res.status(201).json(newCustomer);
});

// Route to get all customers
app.get('/customers', (req, res) => {
  res.json(getAllCustomers());
});

// Route to get a customer by ID
app.get('/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = getCustomerById(customerId);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

// Route to assign a plan to a customer
app.post('/customers/:id/plan', (req, res) => {
  const customerId = parseInt(req.params.id);
  const { planName } = req.body;
  const customer = assignPlan(customerId, planName);
  if (customer) {
    res.json({ message: `Plan assigned to customer ${customerId}` });
  } else {
    res.status(400).json({ message: 'Invalid customer ID or plan name' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));