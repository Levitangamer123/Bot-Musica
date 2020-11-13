const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Muda o volume da musica atual",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Não há nada tocando").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Você precisa entrar em um canal de voz primeiro!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 O volume atual é de: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Utilize um numero para definir o volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Utilize um numero entre 0 e 100").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`O volume foi definido para: **${args[0]}%**`).catch(console.error);
  }
};
