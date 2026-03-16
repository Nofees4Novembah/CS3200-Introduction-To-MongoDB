const { MongoClient } = require('mongodb');

async function main() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('ieeevisTweets');
        const tweetsCollection = db.collection('tweet');
        const usersCollection = db.collection('users');
        const tweetsOnlyCollection = db.collection('Tweets_Only');


        await usersCollection.deleteMany({});
        await tweetsOnlyCollection.deleteMany({});


        const uniqueUsers = await tweetsCollection.aggregate([
            {

                $group: {
                    _id: "$user.id",
                    user: { $first: "$user" }
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$user"
                }
            }
        ]).toArray();

        if (uniqueUsers.length > 0) {
            await usersCollection.insertMany(uniqueUsers);
        }


        const tweetsOnly = await tweetsCollection.aggregate([
            {

                $addFields: {
                    user_id: "$user.id"
                }
            },
            {

                $project: {
                    user: 0
                }
            }
        ]).toArray();

        if (tweetsOnly.length > 0) {
            await tweetsOnlyCollection.insertMany(tweetsOnly);
        }

        console.log("Users collection created with unique users.");
        console.log("Tweets_Only collection created with user references.");
        console.log(` Inserted ${uniqueUsers.length} users.`);
        console.log(` Inserted ${tweetsOnly.length} tweets.`);
    } finally {
        await client.close();
    }
}

main().catch(console.error);