const { MongoClient } = require('mongodb');

async function main() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        // This is the Node.js driver version of your query
        const count = await collection.countDocuments({
            retweeted_status: { $exists: false},
            in_reply_to_status_id: null
        });

        console.log("Query 1 Result:", count);
    } finally {
        await client.close();
    }
}

main().catch(console.error);