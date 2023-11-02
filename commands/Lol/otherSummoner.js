const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { callSummonerData } = require('../../utils/dataRanked');
const { summonerData } = require('../../utils/dataSummoner');


const createEmbed = (name, level, iconUrl, data) => {
  console.log(data);
  const nameSoloq = data.dataSoloq.type;
  const nameFlex = data.dataFlex.type;
  let eloSoloq, lpSoloq, eloFlex, lpFlex;

  if (data.dataSoloq.tier === null || data.dataSoloq.division === null || data.dataSoloq.lp === null) {
    eloSoloq = 'Unranked';
    lpSoloq = 'Unranked';
  } else {
    eloSoloq = `${data.dataSoloq.tier} ${data.dataSoloq.division}`;
    lpSoloq = `${data.dataSoloq.lp} lp`;
  }

  if (data.dataFlex.tier === null || data.dataFlex.division === null || data.dataFlex.lp === null) {
    eloFlex = 'Unranked';
    lpFlex = 'Unranked';
  } else {
    eloFlex = `${data.dataFlex.tier} ${data.dataFlex.division}`;
    lpFlex = `${data.dataFlex.lp} lp`;
  }

  const exampleEmbed = new EmbedBuilder()
    .setColor('#EAEE19')
    .setTitle(name)
    .setThumbnail(iconUrl)
    .addFields(
      { name: 'Level', value: `${level}` },
      { name: `${nameSoloq}`, value: `${eloSoloq} - ${lpSoloq}` },
      { name: `${nameFlex}`, value: `${eloFlex} - ${lpFlex}` },
    );
  return exampleEmbed;
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-invocador')
    .setDescription('Te da los datos de invocador')
    .addStringOption(option =>
      option
        .setName('summoner')
        .setDescription('nombre de invocador')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {

    } catch (error) {
      console.error('Error:', error);
    }

  },
};