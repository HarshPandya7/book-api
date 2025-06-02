// test/books.test.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js

let mongoServer;
let db; // To hold the Mongoose connection

before(async function () {
    this.timeout(30000); // Increase Mocha hook timeout to 30 seconds

    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create({
        instance: {
            // port: 27017, // You can specify a port, or let it pick a random one
        },
        binary: {
            version: '4.4.0', // Specify a stable MongoDB version
            // For troubleshooting, you can add `skipMD5: true` if download integrity issues are suspected:
            // skipMD5: true,
        },
        // For mongodb-memory-server v8+ and later, if needed:
        // autoStart: true,
        // debug: true, // Enable debug logging for MMS if problems persist
    });

    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);

    try {
        db = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated in recent Mongoose, remove if causing warnings
            // useFindAndModify: false, // Deprecated in recent Mongoose, remove if causing warnings
        });
        console.log('MongoDB connected successfully!');
        console.log('Mongoose connected to in-memory MongoDB via app.connectDB.'); // Adjust based on your actual app connection
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; // Re-throw to fail the hook
    }
});

after(async function () {
    this.timeout(30000); // Increase Mocha hook timeout to 30 seconds

    console.log('Disconnecting Mongoose and stopping MongoMemoryServer...');
    try {
        if (mongoose.connection.readyState === 1) { // Check if connected
            await mongoose.disconnect();
            console.log('Mongoose disconnected.');
        } else {
            console.log('Mongoose was not connected or already disconnected.');
        }
    } catch (error) {
        console.error('Error during Mongoose disconnection:', error);
    }

    try {
        // IMPORTANT: Only try to stop if mongoServer was successfully initialized
        if (mongoServer) {
            await mongoServer.stop();
            console.log('MongoMemoryServer stopped.');
        } else {
            console.log('MongoMemoryServer instance was not available to stop.');
        }
    } catch (error) {
        console.error('Error stopping MongoMemoryServer:', error);
    }
});


describe('Books API', () => {
    // Add your existing tests here
    it('should GET all books', async () => {
        const res = await request(app).get('/api/books');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0); // Assuming no books initially
    });
});
