// /test/productTest.spec.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Product API Tests', () => {
  let productId;

  it('should add a new product', (done) => {
    chai
      .request(app)
      .post('/api/products')
      .send({
        name: 'Laptop',
        description: 'Powerful laptop with high specs',
        price: 1200.0,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal('Laptop');
        expect(res.body.description).to.equal('Powerful laptop with high specs');
        expect(res.body.price).to.equal(1200.0);

        // Store the created product ID for later use in other tests
        productId = res.body.id;
        done();
      });
  });

  it('should get a product by ID', (done) => {
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(productId);
        expect(res.body.name).to.equal('Laptop');
        expect(res.body.description).to.equal('Powerful laptop with high specs');
        expect(res.body.price).to.equal(1200.0);
        done();
      });
  });

  it('should update a product', (done) => {
    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .send({
        price: 1300.0,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(productId);
        expect(res.body.price).to.equal(1300.0);
        done();
      });
  });

  it('should delete a product', (done) => {
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').equal('Product deleted successfully');
        done();
      });
  });

  // Test case for getting all products
  it('should get all products', async () => {
    const res = await chai.request(app).get('/api/products');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    // You can add more assertions based on your specific implementation
  });

  // Test case for trying to create a product with missing required fields
  it('should handle creating a product with missing required fields', async () => {
    const res = await chai
      .request(app)
      .post('/api/products')
      .send({
        // Missing required fields
      });

    expect(res).to.have.status(500);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Internal Server Error');
    // Add more assertions based on your specific validation messages
  });

  // Test case for trying to get a product with an invalid ID
  it('should handle getting a product with an invalid ID', async () => {
    const res = await chai.request(app).get('/api/products/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Product not found');
  });

  // Test case for trying to update a product with an invalid ID
  it('should handle updating a product with an invalid ID', async () => {
    const res = await chai
      .request(app)
      .put('/api/products/invalid-id')
      .send({
        // Updated data
      });

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Product not found');
  });

  // Test case for trying to delete a product with an invalid ID
  it('should handle deleting a product with an invalid ID', async () => {
    const res = await chai.request(app).delete('/api/products/invalid-id');

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.equal('Product not found');
  });
});
