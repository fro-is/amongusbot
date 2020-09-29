const maps = ["theskeld", "mirahq", "polus"];
const modes = ["solo", "duo", "trio"];

const db = require("../db");

function victoryVerify(msg, args) {
  const qtyImpostores = msg.mentions.users.size;
  const necessaryArgs = qtyImpostores + 3;
  const mapCode = args[args.length - 1];

  if (!qtyImpostores)
    return "Utilize !amongus help para obter ajuda sobre como utilizar o comando.";

  if (msg.mentions.users.size > 3)
    return "O número máximo de impostores é 3! Utilize !amongus help para obter ajuda.";

  if (args.length != necessaryArgs)
    return "Quantidade inválida de argumentos! Utilize !amongus help para obter ajuda.";

  if (mapCode < 0 || mapCode > 2 || isNaN(mapCode))
    return "O último argumento deve um número do mapa entre 0 e 2. Utilize !amongus help para obter ajuda.";

  const victory = {
    serverID: msg.guild.id,
    mode: modes[qtyImpostores - 1],
    impostors: Array.from(msg.mentions.users.keys()).sort(), // converte o map dos usuarios em um arra
    map: maps[mapCode],
  };
  victory.impostorsKey = victory.impostors.join("-");
  var impostorsMention = "";
  for (let i = 0; i < victory.impostors.length; i++) {
    impostorsMention += `<@${victory.impostors[i]}> `;
  }
  victory.impostorsMention = impostorsMention;

  return victory;
}

module.exports = {
  name: "win",
  description: "Register a win!",
  async execute(msg, args) {
    const result = victoryVerify(msg, args);
    if (typeof result === "string") {
      msg.reply(result);
      return false;
    }
    await db.registerWin(result);
    msg.reply(
      `Vitória registrada para os impostores ${result.impostorsMention}no mapa ${result.map}`
    );
  },
};
