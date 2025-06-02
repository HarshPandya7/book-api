// test/books.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);
const { expect } = chai;

let mongoServer;

before(async () => {
    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Mongoose connected to in-memory MongoDB.');
});

beforeEach(async () => {
    // Optional: Clear database for each test if you're modifying data
    // For simple GET tests, this might not be strictly necessary
    // const Book = require('../src/models/book'); // Assuming you have a Book model
    // await Book.deleteMany({});
});

after(async () => {
    console.log('Disconnecting Mongoose and stopping MongoMemoryServer...');
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('MongoMemoryServer stopped.');
});

describe('Books API', () => {
    it('should GET all books', (done) => {
        chai.request(app)
            .get('/api/books')
            .end((err, res) => {
                if (err) {
                    console.error('Test Error:', err);
                    return done(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    // Add more tests here
});