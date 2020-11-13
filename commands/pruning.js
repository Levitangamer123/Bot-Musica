const fs = require("fs");
let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  description: "Deleta as mensagens após a musica acabar",
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Tem um erro ao escrever o arquivo").catch(console.error);
      }

      return message.channel
        .send(`A deletação de mensagens está ${config.PRUNING ? "**ativada**" : "**desativada**"}`)
        .catch(console.error);
    });
  }
};
