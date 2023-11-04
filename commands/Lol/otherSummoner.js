const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { callSummonerData } = require('../../utils/dataRanked');
const { summonerData } = require('../../utils/dataSummoner');
const { masteryChampsSummoner } = require('../../utils/masteryChamps');


const createEmbed = (name, level, iconUrl, data, champ) => {
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
      { name: 'Info extra', value: 'campeones mas jugados' },
      { name: `${champ[0].champion} - m${champ[0].mastery}`, value: `${champ[0].points} puntos` },
      { name: `${champ[1].champion} - m${champ[1].mastery}`, value: `${champ[1].points} puntos` },
      { name: `${champ[2].champion} - m${champ[2].mastery}`, value: `${champ[2].points} puntos` },
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
      const summoner_name = interaction.options.getString('summoner');
      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      const dataSumm = await summonerData(summoner_name);
      const champ = await masteryChampsSummoner(dataSumm.summ_id);
      const name = dataSumm.name;
      const level = dataSumm.level;
      const iconUrl = `http://ddragon.leagueoflegends.com/cdn/${versionActual}/img/profileicon/${dataSumm.icon}.png`;
      const finalData = await callSummonerData(dataSumm);
      const embed = createEmbed(name, level, iconUrl, finalData, champ);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error:', error);
    }

  },
};