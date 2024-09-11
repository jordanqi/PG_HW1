import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("employees");
    } catch (err) {
        console.error(err);
    }
}

export { db, connectToDB };
