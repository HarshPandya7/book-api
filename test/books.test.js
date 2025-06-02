const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // ✅ Correct path to app.js

chai.use(chaiHttp);
const { expect } = chai;

describe('Books API', () => {
  it('should GET all books', (done) => {
    chai.request(app)
      .get('/api/books')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); // or object depending on your response
        done();
      });
  });
});
