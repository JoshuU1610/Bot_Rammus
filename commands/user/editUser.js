const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { getUserMention } = require('../../utils/discordUtils');
const db = require('../../database');
const { getSummoner } = require('../../utils/dbUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editar-invocador')
    .setDescription('Edita tu invocador')
    .addStringOption(
      Option =>
        Option
          .setName('nombre')
          .setDescription('Tu nombre')
          .setRequired(true)
    ),
  async execute(interaction) {
    const discordId = interaction.user.id;
    const userMention = getUserMention(interaction.user.id);
    const name = interaction.options.getString('nombre');
    try {
      const userOld = getSummoner(discordId);

      if (!userOld) {
        return await interaction.reply(`${userMention} no tienes ningun invocador asociado`);
      }

      const editStatment = `
        UPDATE summoner
        set name = ?
        WHERE user_id = ?
      `;
      db.prepare(editStatment).run(name,discordId);
      const userUpdated = getSummoner(discordId);
      await interaction.reply(`${userMention} tu invocador fue editado a: ${inlineCode(userUpdated.name)}`);
    } catch (error) {
      console.log(error);
    }
  },
};