const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function getTopAdForQuery(query) {
  const collection = await getCollection('Ads');
  const cursor = await collection.aggregate([
    {
      $search: {
        index: 'keywords',
        text: { query: query, path: { wildcard: '*' } },
      },
    },
  ]);
  const ad = await cursor.tryNext();
  client.close();

  return ad;
}

async function getRandomSegue() {
  const collection = await getCollection('Segues');
  const cursor = await collection.aggregate([
    {
      $sample: { size: 1 },
    },
  ]);
  const segue = await cursor.tryNext();
  client.close();

  return segue;
}

async function getCollection(collectionName) {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(collectionName);

  return collection;
}

module.exports = { getTopAdForQuery, getRandomSegue };
