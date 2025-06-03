const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();

const app = require('../src/app'); // Ensure your app exports the Express instance

let mongoServer;

before(async function () {
    this.timeout(30000); // Extend timeout for MongoDB startup

    console.log('Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: '7.0.3' // ✅ Compatible with Debian 12 and modern environments
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
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0); // Expecting no books initially
    });
});
