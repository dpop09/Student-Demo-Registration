import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.MONGODB_API_KEY // **dpop09** grab api key from .env file
const client = new MongoClient(URI, {   // **dpop09** MongoClient is the object that references the connection to project database
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const dbName = 'project3';
const collectionName = 'registered_students';

const dbOperations = {
    getAllRegisteredStudents: async function() {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // user projection to exclude the _id field
        const students = await collection.find({}, { projection: { _id: 0 } }).toArray();
        await client.close();
        return students;
    },
    registerStudent: async function(id, fname, lname, project, email, phone_number, timeslot) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne({
            ID: id,
            fname: fname,
            lname: lname,
            project_name: project,
            email_address: email,
            phone_number: phone_number,
            timeslot: timeslot
        });
        await client.close();
        return result;
    },
    getCount: async function(timeslot) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const count = await collection.countDocuments({ timeslot: timeslot });
        await client.close();
        return count;
    },
    isIdUnique: async function(id) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const count = await collection.countDocuments({ ID: id });
        await client.close();
        return count === 0;
    },
    deleteStudent: async function(id) {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ ID: id });
        await client.close();
        return result;
    }
}

export { dbOperations }
