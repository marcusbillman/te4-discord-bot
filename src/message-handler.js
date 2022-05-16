function handleMessage(message) {
  if (message.content.startsWith('Hej')) {
    message.reply('Hej hej :)');
  }
}

module.exports = { handleMessage };
