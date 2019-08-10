const Discord = require('discord.js');
const controllers = require('./controllers/bot.controllers');
const config = require('./config');
const defaults = require('./defaults');

const client = new Discord.Client();

// Triggers when bot goes online
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Triggered when new member joins
client.on('guildMemberAdd', (member) => {

    // Local date/time
    const dateTime = (new Date()).toGMTString();

    // Default channel
    const rulesChannel = client.channels.find('name', defaults.defaultChannel);

    // Get "Member" role
    const memberRole = member.guild.roles.find('name', defaults.defaultRole);

    // Assign "Member" role to new member
    member.addRole(memberRole);

    // Send member a DM
    member.send(`Welcome to IsleLifeBreaksFree. Please make sure to read rules <#${rulesChannel.id}>`);

    // Send member to "welcome" channel
    client
    .channels
    .find('name','welcome')
    .send(`:confetti_ball: We got a new member <@${member.user.id}> joined ${dateTime} :confetti_ball:`);
});

client.login(config.token);