const Discord = require('discord.js');
const controllers = require('./controllers/bot.controllers');
const config = require('./config');

const bot = new Discord.Client();

// Triggers when bot goes online
bot.on('ready', () => {

    // Log message when Bot starts
    console.log(`Logged in as ${bot.user.tag}`);

});

// Triggered when new member joins
bot.on('guildMemberAdd', (member) => {

    // Assign "Members" role
    controllers.AssignMembersRole(member);
    
});

// Triggers when message received
bot.on('message', (message) => {

    // Ignore bot messages
    if (message.author.bot) return;

    // Ignore DM messages
    if (message.channel.type === 'dm') return;

    // Check if message is command
    if (message.content.startsWith(config.prefix)) {

        // Check if command is assignMembers
        if (message.content.startsWith(`${config.prefix}assignMembers`)) {

            // Excecute logic for adding "Members" role
            controllers.handleAssignMembers(message);

        }

    }
});

bot.login(config.token);