const { MongoClient, ServerApiVersion } = require('mongodb');
const { DEFAULT_GUILD_OPTIONS } = require('./constants');
require('dotenv').config();

let client;
let db;

async function connect() {
  
  client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  db = client.db(process.env.MONGODB_DB);
}

async function close() {
  client.close();
}

async function getAdsForQuery(query) {
  const collection = db.collection('Ads');

  const aggregationPipeline = [
    {
      $search: {
        index: 'keywords',
        text: { query: query, path: { wildcard: '*' } },
      },
    },  
    {
      $project: {
        "_id": 0,
        "name": 1,
        "keywords": 1,
        "videoUrl": 1,
        "content": 1,
        "score": { "$meta": "searchScore" }
      }
    }
  ];

  const cursor = await collection.aggregate(aggregationPipeline);

  const ads = await cursor.toArray();

  return ads
}

async function getRandomSegue() {
  const collection = await db.collection('Segues');

  const aggregationPipeline = [
    {
      $sample: { size: 1 },
    },
  ];

  const cursor = await collection.aggregate(aggregationPipeline);
  const segue = await cursor.tryNext();

  return segue;
}

async function getGuild(guildId) {
  const collection = await db.collection('Guilds');
  const query = { guildId: guildId };
  const guild = await collection.findOne(query);

  // Set any missing guild options to default values
  for (const [key, value] of Object.entries(DEFAULT_GUILD_OPTIONS)) {
    if (guild.options[key] == null) {
      guild.options[key] = value;
    }
  }

  return guild;
}

async function getAllGuilds() {
  const collection = await db.collection('Guilds');
  const guilds = await collection.find({}).toArray();

  return guilds;
}

async function setGuildOptions(guildId, guildOptions) {
  const collection = await db.collection('Guilds');

  const query = {
    guildId: guildId,
  };
  const update = {
    $set: {
      guildId: guildId,
      options: guildOptions,
    },
  };
  const options = { upsert: true };

  await collection.updateOne(query, update, options);
}

async function getLastTrigger(guildId) {
  const collection = await db.collection('Guilds');

  const query = { guildId: guildId };

  const guildInfo = await collection.findOne(query);

  return guildInfo?.lastTrigger;
}

async function upsertLastTrigger(guildId) {
  const collection = await db.collection('Guilds');

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
}

module.exports = {
  connect,
  close,
  getAdsForQuery,
  getRandomSegue,
  getGuild,
  getAllGuilds,
  setGuildOptions,
  upsertLastTrigger,
  getLastTrigger,
};
