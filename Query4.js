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
                $match:
                    {
                    tweet_count: { $gt: 3 }
                    }
            },
            {
                $group: {
                    _id: "$user.screen_name",
                    avg_retweets: { $avg: "$retweet_count" },
                    tweet_count: { $sum: 1 }
                }
            },
            {
                $sort: { avg_retweets: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray();
        console.log("Top 10 people with highest average retweets (with > 3 tweets):");
        console.log(query);
    } finally {
        await client.close();
    }
}

main().catch(console.error);