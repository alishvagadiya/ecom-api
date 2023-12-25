// /test/test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server'); // Update the path accordingly
const { expect } = chai;

chai.use(chaiHttp);

describe('Order API', () => {
  let orderId;
  const customerId = 1;
  it('should place a new order', (done) => {
    chai
      .request(app)
      .post('/api/orders')
      .send({
        customerId: customerId, // Assuming a customer with ID 1 exists
        products: [
          { productId: 1, quantity: 2 }, // Replace with valid product IDs and quantities
          // Add more products as needed
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.customerId).to.equal(customerId); // Replace with the expected customer ID
        // Store the created order ID for later use in other tests
        orderId = res.body.id;
        done();
      });
  });

  it('should get an order by ID', (done) => {
    chai
      .request(app)
      .get(`/api/orders/${orderId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('customerId').equal(customerId); // Update customer ID as needed
        expect(res.body.id).to.equal(orderId);
        done();
      });
  });

  it('should update an order', (done) => {
    chai
      .request(app)
      .put(`/api/orders/${orderId}`)
      .send({
        customerId: customerId, // Update customer ID as needed
        products: [
          { productId: 1, quantity: 3 }, // Replace with valid product IDs and quantities
          // Add more products as needed
        ],
        orderStatus: 'shipped', // Replace with the desired status
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('customerId').equal(customerId);
        expect(res.body.id).to.equal(orderId);
        expect(res.body.orderStatus).to.equal('shipped'); // Replace with the expected status
        done();
      });
  });

  it('should cancel an order', (done) => {
    chai
      .request(app)
      .delete(`/api/orders/${orderId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').equal('Order canceled successfully');
        done();
      });
  });

  // Test case for getting all orders
  // it('should get all orders', async () => {
  //   const res = await chai.request(app).get('/api/orders');

  //   expect(res).to.have.status(200);
  //   expect(res.body).to.be.an('array');
  // });

  // Test case for trying to create an order with missing required fields
  it('should handle creating an order with missing required fields', async () => {
    const res = await chai
      .request(app)
      .post('/api/orders')
      .send({
        // Missing required fields
      });

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Customer not found');
    // Add more assertions based on your specific validation messages
  });

  // Test case for trying to get an order with an invalid ID
  it('should handle getting an order with an invalid ID', async () => {
    const res = await chai.request(app).get('/api/orders/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Order not found');
  });

  // Test case for trying to update an order with an invalid ID
  it('should handle updating an order with an invalid ID', async () => {
    const res = await chai
      .request(app)
      .put('/api/orders/invalid-id')
      .send({
        // Updated data
      });

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Order not found');
  });

  // Test case for trying to delete an order with an invalid ID
  it('should handle deleting an order with an invalid ID', async () => {
    const res = await chai.request(app).delete('/api/orders/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Order not found');
  });
});
