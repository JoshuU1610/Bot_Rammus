const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { getUserMention } = require('../../utils/discordUtils');
const db = require('../../database');
const { getSummoner } = require('../../utils/dbUtils');
const { summonerData } = require('../../utils/dataSummoner');

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
      const userOld = await getSummoner(discordId);

      if (!userOld) {
        return await interaction.reply(`${userMention} no tienes ningun invocador asociado`);
      }
      const data = await summonerData(name);
      const editStatment = `
      UPDATE summoner
      SET summoner = ?,
          summ_id = ?,
          puuid_id = ?,
          account_id = ?
      WHERE user_id = ?;
      
      `;
      db.prepare(editStatment).run(data.name, data.summid, data.puuid, data.accountid, discordId);
      await interaction.reply(`${userMention} tu invocador fue editado a: ${inlineCode(name)}`);
    } catch (error) {
      console.log(error);
    }
  },
};