const { MongoClient } = require('mongodb');

async function main() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        // Return the top 10 screen_names by their number of followers
        const results = await collection.aggregate([
            {
                $group: {
                    _id: "$user.screen_name",
                    followers_count: { $max: "$user.followers_count" }
                }
            },
            { $sort: { followers_count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    screen_name: "$_id",
                    followers_count: 1
                }
            }
        ]).toArray();

        console.log("Query 2 Result - Top 10 screen_names by followers:");
        console.log(results);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

