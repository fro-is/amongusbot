const db = require("../db");
const maps = ["theskeld", "mirahq", "polus"];

function parseMode(top, type) {
  var final = {
    first: [],
    second: [],
    third: [],
  };
  if (type === "solo") {
    final.first.push(`<@${top[2][0]}>`);
    final.first.push(top[2][1]);
    final.second.push(`<@${top[1][0]}>`);
    final.second.push(top[1][1]);
    final.third.push(`<@${top[0][0]}>`);
    final.third.push(top[0][1]);
  } else {
    const names = top.map(i => i[0].split("-"));
    var completed = [];
    names.forEach(name => {
      var mention = "";
      name.forEach(j => {
        mention += `<@${j}> `;
      });
      completed.push(mention);
    });
    final.first.push(completed[2]);
    final.first.push(top[2][1]);
    final.second.push(completed[1]);
    final.second.push(top[1][1]);
    final.third.push(completed[0]);
    final.third.push(top[0][1]);
  }

  return final;
}

module.exports = {
  name: "rank",
  description: "Get victories data!",
  async execute(msg, args) {
    var necessaryArgs = 3;
    const type = args[2];
    if (msg.mentions.users.size) necessaryArgs += msg.mentions.users.size - 1;
    if (args.length != necessaryArgs || msg.mentions.users.size > 3) {
      msg.reply("Quantidade invalida de argumentos!");
      return false;
    }
    // SEARCH BY IMPOSTORS
    if (msg.mentions.users.size) {
      const impostors = Array.from(msg.mentions.users.keys()).sort();
      var impostorsMention = "";
      for (let i = 0; i < impostors.length; i++) {
        impostorsMention += `<@${impostors[i]}> `;
      }
      const impostorsKey = impostors.join("-");
      const mode =
        impostors.length === 1
          ? "solo"
          : impostors.length === 2
          ? "duo"
          : "trio";
      await db.rankImpostors(impostorsKey, msg.guild.id, mode).then(res => {
        if (res.total == 0) {
          msg.reply(
            "Dados insuficientes para rank! Continue registrando vitórias"
          );
          return false;
        }
        msg.channel.send(
          `Quantidade de vitórias do ${mode} ${impostorsMention}:
          Total: ${res.total},
          The Skeld: ${res.theskeld},
          Mira HQ: ${res.mirahq},
          Polus: ${res.polus}`
        );
      });
    }

    if (type === "solo" || type === "duo" || type === "trio") {
      const top = await db.rankMode(msg.guild.id, type);
      if (top.length != 3) {
        msg.reply(
          "Dados insuficientes para rank! Continue registrando vitórias"
        );
        return false;
      }
      const fileredTop = parseMode(top, type);
      msg.reply(`Ranking de vitórias ${type}:
      Top 1: ${fileredTop.first[0]} - ${fileredTop.first[1]} vitórias!
      Top 2: ${fileredTop.second[0]} - ${fileredTop.second[1]} vitórias!
      Top 3: ${fileredTop.third[0]} - ${fileredTop.third[1]} vitórias!`);
    }
  },
};
