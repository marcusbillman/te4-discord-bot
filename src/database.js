const { MongoClient, ServerApiVersion } = require('mongodb');
const { DEFAULT_GUILD_OPTIONS } = require('./constants');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function getTopAdForQuery(query) {
  const collection = await getCollection('Ads');

  const aggregationPipeline = [
    {
      $search: {
        index: 'keywords',
        text: { query: query, path: { wildcard: '*' } },
      },
    },
  ];

  const cursor = await collection.aggregate(aggregationPipeline);
  const ad = await cursor.tryNext();
  client.close();

  return ad;
}

async function getRandomSegue() {
  const collection = await getCollection('Segues');

  const aggregationPipeline = [
    {
      $sample: { size: 1 },
    },
  ];

  const cursor = await collection.aggregate(aggregationPipeline);
  const segue = await cursor.tryNext();
  client.close();

  return segue;
}

async function getGuild(guildId) {
  const collection = await getCollection('Guilds');
  const query = { guildId: guildId };
  const guild = await collection.findOne(query);

  // Set any missing guild options to default values
  for (const [key, value] of Object.entries(DEFAULT_GUILD_OPTIONS)) {
    if (guild.options[key] == null) {
      guild.options[key] = value;
    }
  }

  client.close();
  return guild;
}

async function setGuildOptions(guildId, guildOptions) {
  const collection = await getCollection('Guilds');

  const query = {
    guildId: guildId,
  };
  const update = {
    $set: {
      options: guildOptions,
    },
  };
  const options = { upsert: true };

  await collection.updateOne(query, update, options);

  client.close();
}

async function getLastTrigger(guildId) {
  const collection = await getCollection('Guilds');

  const query = { guildId: guildId };

  const guildInfo = await collection.findOne(query);

  client.close();

  return guildInfo?.lastTrigger;
}

async function upsertLastTrigger(guildId) {
  const collection = await getCollection('Guilds');

  const query = {
    guildId: guildId,
  };

  const update = {
    $set: {
      guildId: guildId,
      lastTrigger: new Date(),
    },
  };
  const options = { upsert: true };

  await collection.updateOne(query, update, options);

  client.close();
}

async function getCollection(collectionName) {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(collectionName);

  return collection;
}

module.exports = {
  getTopAdForQuery,
  getRandomSegue,
  getGuild,
  setGuildOptions,
  upsertLastTrigger,
  getLastTrigger,
};
