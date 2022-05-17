const database = require('./database');

async function handleMessage(message) {
  const segue = await database.getRandomSegue();
  const ad = await database.getTopAdForQuery(message.content);
  if (segue === null || ad === null) return;

  const firstKeyword = ad.keywords.find((keyword) =>
    message.content.includes(keyword)
  );
  const interpolatedSegue = segue.content
    .replace('[N]', ad.name)
    .replace('[K]', firstKeyword);

  message.reply(`${interpolatedSegue}\n\n${ad.content}`);
}

module.exports = { handleMessage };
