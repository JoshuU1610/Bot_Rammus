const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { getUserMention } = require('../../utils/discordUtils');
const db = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guardar-tu-invocador')
    .setDescription('Guarda tu nombre de invocador')
    .addStringOption(
      Option =>
        Option
          .setName('invocador')
          .setDescription('Tu nombre de invocador')
          .setRequired(true)
    ),
  async execute(interaction) {
    const userMention = getUserMention(interaction.user.id);
    try {
      const name = interaction.options.getString('invocador');
      const statment = 'INSERT INTO summoner (user_id, summoner) VALUES (?,?)';
      db.prepare(statment).run(interaction.user.id, name);
      await interaction.reply(`${userMention} se registro ${inlineCode(name)} como tu nombre de invocador asociado`);
    } catch (error) {
      console.log(error);
      switch (error.code) {
      case 'SQLITE_CONSTRAINT_PRIMARYKEY':
        await interaction.reply(`${userMention} tu usuario ya existe`);
        break;
      default:
        await interaction.reply(`${userMention} hubo un error`);
        break;
      }
    }

  },
};