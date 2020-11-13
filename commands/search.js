const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");

let YOUTUBE_API_KEY;
try {
  const config = require("../config.json");
  YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;
} catch (error) {
  YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
}
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "search",
  description: "Procura e seleciona videos para tocar",
  async execute(message, args) {
    if (!args.length)
      return message
        .reply(`Utilize: ${message.client.prefix}${module.exports.name} <Nome do Video>`)
        .catch(console.error);
    if (message.channel.activeCollector)
      return message.reply("Um coletor de mensagens já está ativo nesse canal");
    if (!message.member.voice.channel)
      return message.reply("Você precisa entrar no canal primeiro!").catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**Responda com o numero da musica que você deseja reproduzir!**`)
      .setDescription(`Resultados para: ${search}`)
      .setColor("#F8AA2A");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const reply = response.first().content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await message.client.commands
            .get("play")
            .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        message.client.commands.get("play").execute(message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply(error.message).catch(console.error);
    }
  }
};
