// test/books.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
// Import both 'app' and 'connectDB' from your updated app.js
const { app, connectDB } = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);
const { expect } = chai;

let mongoServer; // To hold the instance of the memory server

// --- Setup and Teardown for all tests ---

before(async () => {
    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);

    // Call the connectDB function from your app.js with the in-memory URI
    await connectDB(mongoUri); // <--- IMPORTANT CHANGE HERE
    console.log('Mongoose connected to in-memory MongoDB via app.connectDB.');
});

after(async () => {
    console.log('Disconnecting Mongoose and stopping MongoMemoryServer...');
    // Ensure Mongoose is properly disconnected by getting the connection instance
    await mongoose.connection.close(); // Use connection.close() for clean disconnect
    await mongoServer.stop();
    console.log('MongoMemoryServer stopped.');
});

beforeEach(async () => {
    // Clear collections if needed, e.g., to ensure tests are isolated
    // Make sure you have your Book model imported if using this:
    // const Book = require('../src/models/book');
    // await Book.deleteMany({});
    // console.log('Cleared database for new test.');
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

    // Add more tests here (e.g., POST, GET by ID, PUT, DELETE)
});