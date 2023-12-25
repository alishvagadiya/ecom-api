// /test/test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server'); // Update the path accordingly
const { expect } = chai;

chai.use(chaiHttp);

describe('Edge Cases and Additional Tests', () => {
  it('should handle invalid routes with 404 Not Found', (done) => {
    chai
      .request(app)
      .get('/api/nonexistentroute')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle invalid customer ID with 404 Not Found', (done) => {
    chai
      .request(app)
      .get('/api/customers/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle invalid order ID with 404 Not Found', (done) => {
    chai
      .request(app)
      .get('/api/orders/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle invalid request payload with 400 Bad Request', (done) => {
    chai
      .request(app)
      .post('/api/customers')
      .send({
        invalidField: 'Invalid Value',
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should handle updating a non-existing customer with 404 Not Found', (done) => {
    chai
      .request(app)
      .put('/api/customers/999')
      .send({
        name: 'Updated Name',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle deleting a non-existing customer with 404 Not Found', (done) => {
    chai
      .request(app)
      .delete('/api/customers/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle updating a non-existing order with 404 Not Found', (done) => {
    chai
      .request(app)
      .put('/api/orders/999')
      .send({
        customerId: 1,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should handle deleting a non-existing order with 404 Not Found', (done) => {
    chai
      .request(app)
      .delete('/api/orders/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});