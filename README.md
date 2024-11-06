# Adrian Bot

Mr *Ad*rian is a helpful (infuriating) Discord bot that turns chat conversations into ad reads, Linus Tech Tips style.

The bot has a list of pre-defined products and their related keywords. Whenever someone in a connected Discord server sends a message containing a keyword, the bot responds with a smooth segue into a full-on sponsor segment for the corresponding (barely related) product.

Also, if the sender is in a voice channel, Mr Adrian joins it and plays the audio of a commercial video for that product.

Mr Adrian is a half-leisure-half-school project made by [Marcus Billman](https://github.com/marcusbillman) and [Christian Bäckström](https://github.com/ChristianBackstrom). This repo is an archive of the project.

## Database exports

The bot uses a MongoDB database hosted on MongoDB Atlas. The `db_exports` directory contains JSON and CSV dumps of the database collections.
