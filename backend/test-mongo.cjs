const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BnW_user:C11zaPcv7uiIIeoo@bnw-prod.sxhyyl9.mongodb.net/b&wDB?appName=BnW-prod";
const client = new MongoClient(uri);

async function run() {
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas!");
        const db = client.db("b&wDB");
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    } catch (error) {
        console.error("Failed to connect:");
        console.error(error);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
