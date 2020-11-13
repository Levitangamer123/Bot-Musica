const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove uma musica da fila",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não há musicas na fila!.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(`Use: ${message.client.prefix}remove <Numero da Fila>`);
    if (isNaN(args[0])) return message.reply(`Use: ${message.client.prefix}remove <Numero da Fila>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ removeu **${song[0].title}** da fila de reprodução.`);
  }
};
