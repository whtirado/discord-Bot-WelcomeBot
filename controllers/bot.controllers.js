const discord = require('discord.js');
const defaults = require('../defaults');

const botControllers = {

    // Get guild roles
    getRole: (context, targetRole) => {
        return context.guild.roles.find((role) => {
            return role.name === targetRole;
        });
    },

    // Get guild channels
    getChannel: (context, targetChannel) => {
        return context.guild.channels.find((channel) => {
            return channel.name === targetChannel;
        });
    },

    AssignMembersRole: (member) => {
    
        // Get default "Members" role
        const membersRole = botControllers.getRole(member, defaults.defaultRole);
    
        // Get default DM mention channel
        const rulesChannel = botControllers.getChannel(member, defaults.defaultDmMentionChannel);
    
        // Get default welcome channel
        const welcomeChannel = botControllers.getChannel(member, defaults.defaultWelcome);
    
        // Assign "Member" role to new member
        member.addRole(membersRole).then(() => {

            const date = (new Date()).toDateString();

            const richEmbed = new discord.RichEmbed()
                .setColor('#e0c619')
                .setTitle('New Member')
                .setAuthor(member.user.tag, member.user.avatarURL)
                .setDescription(`Hello, I'm <@${member.user.id}>. I just became a member.`)
                .setThumbnail(member.user.avatarURL)
                .setFooter(date);
    
            // Log new members to console
            console.log(`New member added ${member.user.tag}`);
    
            // Send member a DM
            member.send(`Welcome to IsleLifeBreaksFree. Please make sure to read rules <#${rulesChannel.id}>`);
    
            // Send member to "welcome" channel
            welcomeChannel.send(richEmbed);
    
        })
        .catch(() => {
    
            // Send message channel an error message
            console.log(`Command Error: Did not assign "Members" role to ${member.user.tag}`);
    
        });
    
    },

    handleAssignMembers: (message) => {

        // Check if member has permissions
        if (message.member.hasPermission('MANAGE_ROLES')) {
    
            // Affected members
            let affectedMembers = 0;
    
            // Assign "Members" role to new members
            message.guild.members.forEach((member) => {
                if (member.roles.size == 1) {
    
                    // Increment number of members affected by command
                    affectedMembers += 1;
    
                    // Assign "Members" role
                    botControllers.AssignMembersRole(member);
    
                }
            });
    
            // Respond to member with command details
            message.channel.send(`Command excecuted: ${affectedMembers} member(s) affected.`);
    
        }
    
    },

    assignSeniorMembers: (message) => {

        // Check for permissions
        if (message.member.hasPermission('MANAGE_ROLES')) {

            // Get "Senior Members" role
            const seniorRole = botControllers.getRole(message, 'Senior Members');

            // Get "Members" role
            const memberRole = botControllers.getRole(message, 'Members');

            // Loop for each member mentioned
            message.mentions.members.forEach((member) => {

                // Remove "Members" role
                member.removeRole(memberRole).then((member) => {
                    return member.addRole(seniorRole);
                })

                // Add "Senior Members" role
                .then((member) => {

                    const date = (new Date()).toDateString();

                    const richEmbed = new discord.RichEmbed()
                        .setColor('#e0c619')
                        .setTitle('New Senior Member')
                        .setAuthor(member.user.tag, member.user.avatarURL)
                        .setDescription(`Hello, I'm <@${member.user.id}>. I just became a Senior Member.`)
                        .setThumbnail(member.user.avatarURL)
                        .setFooter(date);

                    // Send channel a message with each Senior Member added
                    message.channel.send(richEmbed);
                
                });

            });

        }
    },

    kickMember: (message) => {

        // Check if member has permissions
        if (message.member.hasPermission('KICK_MEMBERS')) {

            // Loop for each mention
            message.mentions.users.forEach((mention) => {

                // Get member
                const member = message.guild.members.get(mention.id);

                // Kick member
                member.kick().then((response) => {
                    console.log(`User kicked: ${response.user.tag}`);
                    message.channel.send(`User kicked: ${response.user.tag}`);
                });

            });

        }

    }
};

module.exports = botControllers;