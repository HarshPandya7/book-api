// test/books.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Your Express app
const mongoose = require('mongoose'); // Mongoose is needed to connect to the DB
const { MongoMemoryServer } = require('mongodb-memory-server'); // Import the memory server

chai.use(chaiHttp);
const { expect } = chai;

let mongoServer; // This variable will hold the instance of our in-memory MongoDB server

// --- Setup and Teardown for all tests ---

// 'before' hook runs once before all tests in this describe block start
before(async () => {
    console.log('Starting MongoMemoryServer...');
    // 1. Create and start a new in-memory MongoDB server instance.
    //    'create()' returns a Promise that resolves when the server is ready.
    mongoServer = await MongoMemoryServer.create();

    // 2. Get the connection URI (e.g., 'mongodb://127.0.0.1:50130/jest') from the started server.
    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);

    // 3. Connect Mongoose to this in-memory MongoDB URI.
    //    We explicitly tell Mongoose to use this URI instead of the 'localhost' one in app.js.
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true:
        // You might need to add this for Mongoose 6+ to suppress a warning:
        // serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
    });
    console.log('Mongoose connected to in-memory MongoDB.');
});

// 'after' hook runs once after all tests in this describe block have finished
after(async () => {
    console.log('Disconnecting Mongoose and stopping MongoMemoryServer...');
    // 1. Disconnect Mongoose from the database.
    await mongoose.disconnect();
    // 2. Stop the in-memory MongoDB server instance.
    await mongoServer.stop();
    console.log('MongoMemoryServer stopped.');
});

// --- Optional: Setup and Teardown for each test (for clean slate) ---

// 'beforeEach' hook runs before each individual 'it' test
beforeEach(async () => {
    // This is useful if your tests modify the database and you want a clean state for each test.
    // Example: Delete all documents from the 'books' collection (assuming you have a Book model)
    // const Book = require('../src/models/book');
    // await Book.deleteMany({});
    // console.log('Cleared database for new test.');

    // Alternatively, you could just drop the entire database if you have many collections:
    // if (mongoose.connection.readyState === 1) { // Ensure connection is open
    //     await mongoose.connection.db.dropDatabase();
    // }
});


// --- Your actual tests ---

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
                expect(res.body).to.be.an('array'); // or object depending on your response
                done(); // Crucially, call done() when the async operations are complete
            });
    });

    // Add more tests here:
    // it('should create a new book on POST', (done) => { /* ... */ });
    // it('should get a single book by ID', (done) => { /* ... */ });
});