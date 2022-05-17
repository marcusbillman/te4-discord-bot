const database = require('./database');

async function handleMessage(message, distube) {
  const ad = await database.getTopAdForQuery(message.content);
  if (ad == null) return;

  if (message.member.voice.channel != null && ad.videoUrl != null) {
    playAdVideo(ad.videoUrl, message, distube);
  }
  await replyWithSegueAndAd(ad, message);
}

function playAdVideo(videoUrl, message, distube) {
  distube.play(message.member.voice.channel, videoUrl, {
    message,
    textChannel: message.channel,
    member: message.member,
  });
}

async function replyWithSegueAndAd(ad, message) {
  const segue = await database.getRandomSegue();

  const firstKeyword = ad.keywords.find((keyword) =>
    message.content.includes(keyword)
  );
  const interpolatedSegue = segue.content
    .replace('[N]', ad.name)
    .replace('[K]', firstKeyword);

  message.reply(`${interpolatedSegue}\n\n${ad.content}`);
}

module.exports = { handleMessage };
