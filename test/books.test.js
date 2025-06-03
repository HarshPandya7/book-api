const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');

const { app } = require('../src/app'); // Ensure app exports the Express instance

let mongoServer;

before(async function () {
    this.timeout(30000); // Allow extra time for MongoDB to spin up

    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: '7.0.3' // Compatible with Debian 12 and most CI systems
        }
    });

    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
});

after(async function () {
    this.timeout(30000);

    console.log('Disconnecting Mongoose and stopping MongoMemoryServer...');
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('Mongoose disconnected.');
        }
    } catch (error) {
        console.error('Error during Mongoose disconnection:', error);
    }

    try {
        if (mongoServer) {
            await mongoServer.stop();
            console.log('MongoMemoryServer stopped.');
        }
    } catch (error) {
        console.error('Error stopping MongoMemoryServer:', error);
    }
});

describe('Books API', () => {
    it('should GET all books', async () => {
        const res = await request(app).get('/api/books');

        // Assertions using Chai's expect
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0); // Assuming database is empty at test start
    });
});
