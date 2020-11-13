const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "Pula a musica atual para uma outra musica selecionada da fila",
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(`Utilize: ${message.client.prefix}${module.exports.name} <Numero da Musica na Fila>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não há musicas sendo reproduzidas.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(`A fila é apenas ${queue.songs.length} musicas longas!`).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ pulou ${args[0] - 1} musicas`).catch(console.error);
  }
};
