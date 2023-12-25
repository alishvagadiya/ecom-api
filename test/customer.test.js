// /test/test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server'); // Update the path accordingly
const { expect } = chai;

chai.use(chaiHttp);

// Inside the describe block in /test/test.js
describe('Customer API', () => {
  let customerId;
  let name = 'John Doe';
  let email = 'john.doe.test123@example.com';
  let address = '123 Main Street';

  it('should add a new customer', (done) => {
    chai
      .request(app)
      .post('/api/customers')
      .send({ name, email, address })
      .end((err, res) => {
        console.log({ res })
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal(name);
        expect(res.body.email).to.equal(email);
        expect(res.body.address).to.equal(address);
        customerId = res.body.id;
        done();
      });
  });

  it('should get a customer by ID', (done) => {
    chai
      .request(app)
      .get(`/api/customers/${customerId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(customerId);
        expect(res.body.name).to.equal(name);
        expect(res.body.email).to.equal(email);
        expect(res.body.address).to.equal(address);
        done();
      });
  });

  it('should update a customer', (done) => {
    chai
      .request(app)
      .put(`/api/customers/${customerId}`)
      .send({
        name: 'John Updated'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('John Updated');
        expect(res.body.email).to.equal(email);
        expect(res.body.address).to.equal(address);
        done();
      });
  });

  it('should delete a customer', (done) => {
    chai
      .request(app)
      .delete(`/api/customers/${customerId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').equal('Customer deleted successfully');
        done();
      });
  });

  // Test case for getting all customers
  it('should get all customers', async () => {
    const res = await chai.request(app).get('/api/customers');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    // You can add more assertions based on your specific implementation
  });

  // Test case for trying to create a customer with missing required fields
  it('should handle creating a customer with missing required fields', async () => {
    const res = await chai
      .request(app)
      .post('/api/customers')
      .send({
        // Missing required fields
      });

    expect(res).to.have.status(500);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Internal Server Error');
    // Add more assertions based on your specific validation messages
  });

  // Test case for trying to get a customer with an invalid ID
  it('should handle getting a customer with an invalid ID', async () => {
    const res = await chai.request(app).get('/api/customers/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Customer not found');
  });

  // Test case for trying to update a customer with an invalid ID
  it('should handle updating a customer with an invalid ID', async () => {
    const res = await chai
      .request(app)
      .put('/api/customers/invalid-id')
      .send({
        // Updated data
      });

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Customer not found');
  });

  // Test case for trying to delete a customer with an invalid ID
  it('should handle deleting a customer with an invalid ID', async () => {
    const res = await chai.request(app).delete('/api/customers/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Customer not found');
  });
});
