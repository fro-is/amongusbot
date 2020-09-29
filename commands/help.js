module.exports = {
  name: "help",
  description: "How to use the bot!",
  execute(msg, args) {
    msg.reply(
      "```md\n<!Criado por: @thiagopf - github.com/tpfrois>\n# !amongus win\n   Utilize esse comando para registrar uma vitória mencionando em seguida os @ dos impostores. Após mencionar os impostores, digite o código do mapa da vitória, sendo:\n      - 0 - The Skeld\n      - 1 - Mira HQ\n      - 2 - Polus\n# !amongus rank\n   Utilize este comando para ver os ranks:\n   - !amongus rank @ mencionando o(s) impostor(es) para obter a lista de vitórias\n   - amongus rank solo/duo/trio para obter os três melhores de cada modo```"
    );
  },
};
