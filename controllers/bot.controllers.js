exports.onReady = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
};

exports.onNewMember = (member) => {

    // Get "Member" role
    const memberRole = member.guild.roles.find('name', 'Member');

    // Assign "Member" role to new member
    member.addRole(memberRole);

    // Send member a DM
    member.send('Welcome to IsleLifeBreaksFree :)');

    // Send member to "welcome" channel
    client.channels.find('name','welcome').send(`We got a new member <@${member.user.tag}>`);
};