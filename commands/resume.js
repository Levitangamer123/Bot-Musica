const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "unpause",
  aliases: ["r"],
  description: "Despausa uma musica",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Não há nada sendo tocado.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ despausou a musica!`).catch(console.error);
    }

    return message.reply("A fila não está pausada").catch(console.error);
  }
};
