const Discord = require('discord.js');
const config = require('./config');
const defaults = require('./defaults');

const client = new Discord.Client();

// Triggers when bot goes online
client.on('ready', () => {
    // Local date/time when Bot started
    const dateTime = (new Date()).toGMTString();

    // Log message when Bot starts
    console.log(`Logged in as ${client.user.tag} @ ${dateTime}`);
});

//
client.on('disconnect', (errMsg, code) => {
    console.log('Bot Disconnected...');
    console.log(`Error (${code}): ${errMsg}`);
    client.login(config.token);
});

// Triggered when new member joins
client.on('guildMemberAdd', (member) => {

    // Local date/time when user joined
    const dateTime = (new Date()).toGMTString();

    // Default channel
    const rulesChannel = client.channels.find((channel) => {
        return channel.name === defaults.defaultChannel;
    });

    // Get "Member" role
    const memberRole = member.guild.roles.find((role) => {
        return role.name === defaults.defaultRole;
    });

    // Welcome message
    const defaultWelcomeMessage = `:confetti_ball: We got a new member <@${member.user.id}> joined ${dateTime} :confetti_ball:`;

    // Log new member tag
    console.log(`New member: ${member.user.tag} @ ${dateTime}`);

    // Assign "Member" role to new member
    member.addRole(memberRole);

    // Send member a DM
    member.send(`Welcome to IsleLifeBreaksFree. Please make sure to read rules <#${rulesChannel.id}>`);

    // Send member to "welcome" channel
    client
    .channels
    .find((channel) => {
        return channel.name === defaults.defaultWelcome;
    })
    .send(defaultWelcomeMessage);
});

client.login(config.token);