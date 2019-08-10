const Discord = require('discord.js');
const controllers = require('./controllers/bot.controllers');
const config = require('./config');

const client = new Discord.Client();

// Triggers when bot goes online
client.on('ready', () => {
    controllers.onReady(client);
});

// Triggered when new member joins
client.on('guildMemberAdd', (member) => {
    controllers.onNewMember(member);
});

client.login(config.token);