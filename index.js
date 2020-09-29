require("dotenv").config();
const discord = require("discord.js");

const bot = new discord.Client();
const TOKEN = process.env.TOKEN;

bot.commands = new discord.Collection();
const botCommands = require("./commands");

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN);

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("guildCreate", guild => {
  console.log(
    `Novo servidor: ${guild.name} (id: ${guild.id}). ${guild.memberCount} members!`
  );
});

bot.on("message", msg => {
  if (!msg.content.startsWith("!amongus")) return;
  const args = msg.content.split(/ +/); // mensagem separada por espaços - array
  if (args.length === 1) return;
  const command = args[1].toLowerCase(); // primeiro elemento da array depois do !amongus

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.log(error);
    msg.reply("Ocorreu um erro ao executar o comando!");
  }
});
