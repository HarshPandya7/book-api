const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { app, connectDB } = require('../src/app'); // Destructure app and connectDB
const chai = require('chai');
chai.should();

let mongoServer;

before(async function () {
    this.timeout(30000); // Allow MongoDB download/setup time

    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: '7.0.3' // Match the downloaded version from your Jenkins logs
        }
    });

    const mongoUri = mongoServer.getUri();
    console.log(`MongoMemoryServer running at: ${mongoUri}`);

    try {
        await connectDB(mongoUri); // Use the exported function from app.js
    } catch (err) {
        console.error('MongoDB connection error in test:', err);
        throw err;
    }
});

after(async function () {
    this.timeout(30000);

    try {
        await mongoose.disconnect();
        console.log('Mongoose disconnected.');
    } catch (err) {
        console.error('Disconnection error:', err);
    }

    if (mongoServer) {
        await mongoServer.stop();
        console.log('MongoMemoryServer stopped.');
    }
});

describe('Books API', () => {
    it('should GET all books', async () => {
        const res = await request(app).get('/api/books');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0); // Assuming DB starts empty
    });
});
