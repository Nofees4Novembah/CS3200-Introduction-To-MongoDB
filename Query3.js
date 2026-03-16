const { MongoClient } = require('mongodb') ;

async function main() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('ieeevisTweets');
        const collection = db.collection('tweet');

        const query = await collection.aggregate([
            {
                $group: {
                    _id: "$user.screen_name",
                    tweet_count: { $sum: 1 }
                }
            },
            {
                $sort: { tweet_count: -1 }
            },
            {
                $limit: 1
            }
        ]).toArray();
        console.log("Person That Got the Most Tweets:");
        console.log(query);
        }finally {
        await client.close();
        }
    }

main().catch(console.error);