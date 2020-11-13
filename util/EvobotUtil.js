module.exports = {
  canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
      member.send("Você precisa entrar em um canal primeiro!").catch(console.error);
      return;
    }

    return true;
  }
};
