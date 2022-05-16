const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function getTopAdForQuery(query) {
  await client.connect();

  const db = client.db('Bot');
  const collection = db.collection('Ads');
  const ad = await collection.findOne({
    $text: { $search: 'vpn' },
  });

  return ad;
}

module.exports = { getAllData };
