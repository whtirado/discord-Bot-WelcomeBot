const Discord = require('discord.js');
const config = require('./config');
const defaults = require('./defaults');

const bot = new Discord.Client();

const getRole = (member, targetRole) => {
    return member.guild.roles.find((role) => {
        return role.name === targetRole;
    });
};

const ChannelMessage = (targetChannel, message) => {
    const channel = bot.channels.find((channel) => {
        return channel.name === targetChannel;
    });
    
    if (channel) {
        channel.send(message);
    }
};

// Triggers when bot goes online
bot.on('ready', () => {

    // Local date/time when Bot started
    const dateTime = (new Date()).toDateString();

    // Log message when Bot starts
    console.log(`Logged in as ${bot.user.tag} @ ${dateTime}`);

});

// Triggered when new member joins
bot.on('guildMemberAdd', (member) => {

    // Local date/time when user joined
    const dateTime = (new Date()).toDateString();

    // Default channel
    const rulesChannel = bot.channels.find((channel) => {
        return channel.name === defaults.defaultChannel;
    });

    // Get "Members" role
    const memberRole = getRole(member, defaults.defaultRole);

    // Welcome message
    const defaultWelcomeMessage = `:confetti_ball: We got a new member <@${member.user.id}> joined ${dateTime} :confetti_ball:`;

    // Assign "Member" role to new member
    member.addRole(memberRole);

    // Log new members to console
    console.log(`New member added ${member.user.tag} on ${dateTime}`);

    // Send member a DM
    member.send(`Welcome to IsleLifeBreaksFree. Please make sure to read rules <#${rulesChannel.id}>`);

    // Send member to "welcome" channel
    ChannelMessage(defaults.defaultWelcome, defaultWelcomeMessage);
});

// Triggers when message received
bot.on('message', (message) => {
    const isCommand = message.content.startsWith(config.prefix);

    // Check if message is command
    if (isCommand) {

        // Local date/time when command was typed
        const dateTime = (new Date()).toDateString();

        // Check if command is assignMembers
        if (message.content.startsWith(`${config.prefix}assignMembers`)) {

            // Check if member has permissions
            if (message.member.hasPermission('MANAGE_ROLES')) {

                // Affected members
                const affectedMembers = 0;

                // Welcome message
                const defaultWelcomeMessage = `:confetti_ball: We got a new member <@${message.member.user.id}> joined ${dateTime} :confetti_ball:`;

                // Get "Members" role
                const memberRole = getRole(message, defaults.defaultRole);

                // Assign 'Members' role to new members
                message.guild.members.forEach((member) => {
                    if (member.roles.size === 1) {
                        affectedMembers += 1;
                        member.addRole(memberRole);
                        ChannelMessage(defaults.defaultWelcome, defaultWelcomeMessage);
                    }
                });

                // Respond to member with command details
                message.channel.send(`Command excecuted: ${affectedMembers} member(s) affected.`);

            }

        }

    }
});

bot.login(config.token);