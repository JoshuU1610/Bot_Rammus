const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { getUserMention } = require('../../utils/discordUtils');
const db = require('../../database');
const { summonerData } = require('../../utils/dataSummoner');

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
    await interaction.deferReply();
    try {
      const name = interaction.options.getString('invocador');
      const data = await summonerData(name);
      console.log(data);
      const statment = 'INSERT INTO summoner (user_id, summoner, summ_id, puuid_id, account_Id) VALUES (?,?,?,?,?)';
      db.prepare(statment).run(interaction.user.id, data.name, data.summid, data.puuid, data.accountid);
      await interaction.editReply(`${userMention} se registro ${inlineCode(data.name)} como tu nombre de invocador asociado`);
    } catch (error) {
      console.log(error);
      switch (error.code) {
      case 'SQLITE_CONSTRAINT_PRIMARYKEY':
        await interaction.editReply(`${userMention} tu usuario ya existe`);
        break;
      default:
        await interaction.editReply(`${userMention} hubo un error`);
        break;
      }
    }

  },
};