const defaults = require('../defaults');

const botControllers = {

    getRole: (context, targetRole) => {
        return context.roles.find((role) => {
            return role.name === targetRole;
        });
    },

    getChannel: (context, targetChannel) => {
        return context.channels.find((channel) => {
            return channel.name === targetChannel;
        });
    },

    AssignMembersRole: (member) => {

        // Local date/time when user joined
        const dateTime = (new Date()).toDateString();
    
        // Get default "Members" role
        const membersRole = botControllers.getRole(member.guild, defaults.defaultRole);
    
        // Get default DM mention channel
        const rulesChannel = botControllers.getChannel(member.guild, defaults.defaultDmMentionChannel);
    
        // Get default welcome channel
        const welcomeChannel = botControllers.getChannel(member.guild, defaults.defaultWelcome);
    
        // Default welcome message
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
            const seniorRole = botControllers.getRole(message.guild, 'Senior Members');

            // Get "Members" role
            const memberRole = botControllers.getRole(message.guild, 'Members');

            // Loop for each member mentioned
            message.mentions.members.forEach((member) => {

                // Remove "Members" role
                member.removeRole(memberRole).then((member) => {
                    return member.addRole(seniorRole);
                })

                // Add "Senior Members" role
                .then((member) => {

                    // Send channel a message with each Senior Member added
                    message.channel.send(`:confetti_ball: Senior Member status assigned to <@${member.user.id}> :confetti_ball:`);
                
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