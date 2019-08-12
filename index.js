const Discord = require('discord.js');
const config = require('./config');
const defaults = require('./defaults');

const bot = new Discord.Client();

// Get role by name
const getRole = (context, targetRole) => {
    return context.roles.find((role) => {
        return role.name === targetRole;
    });
};

// Get channel by name
const getChannel = (context, targetChannel) => {
    return context.channels.find((channel) => {
        return channel.name === targetChannel;
    });
};

// Assign "Members" role and welcome new member
const AssignMembersRole = (member) => {

    // Local date/time when user joined
    const dateTime = (new Date()).toDateString();

    // Get "Members" role
    const membersRole = getRole(member.guild, defaults.defaultRole);

    // Get default DM mention channel
    const rulesChannel = getChannel(member.guild, defaults.defaultDmMentionChannel);

    // Get welcome channel
    const welcomeChannel = getChannel(member.guild, defaults.defaultWelcome);

    // Welcome message
    const defaultWelcomeMessage = `:confetti_ball: We got a new member <@${member.user.id}> joined ${dateTime} :confetti_ball:`;

    // Assign "Member" role to new member
    member.addRole(membersRole).then(() => {

        // Log new members to console
        console.log(`New member added ${member.user.tag} on ${dateTime}`);

        // Send member a DM
        member.send(`Welcome to IsleLifeBreaksFree. Please make sure to read rules <#${rulesChannel.id}>`);

        // Send member to "welcome" channel
        welcomeChannel.send(defaultWelcomeMessage);

    })
    .catch(() => {

        // Send message channel an error message
        console.log(`Command Error: Did not assign "Members" role to ${member.user.tag}`);

    });

};

// Triggers when bot goes online
bot.on('ready', () => {

    // Log message when Bot starts
    console.log(`Logged in as ${bot.user.tag}`);

});

// Triggered when new member joins
bot.on('guildMemberAdd', (member) => {

    // Assign "Members" role
    AssignMembersRole(member);
    
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

            // Check if member has permissions
            if (message.member.hasPermission('MANAGE_ROLES')) {

                // Affected members
                let affectedMembers = 0;

                // Assign "Members" role to new members
                message.guild.members.forEach((member) => {
                    if (member.roles.size == 1) {

                        // Increment number of members affected by commad
                        affectedMembers += 1;

                        // Assign "Members" role
                        AssignMembersRole(member);

                    }
                });

                // Respond to member with command details
                message.channel.send(`Command excecuted: ${affectedMembers} member(s) affected.`);

            }

        }

    }
});

bot.login(config.token);