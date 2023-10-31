const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { callSummonerData } = require('../../utils/dataOpgg');


const createEmbed = (name, level, iconUrl, data) => {
  console.log(data);
  const nameSoloq = data.dataSoloq.type;
  const nameFlex = data.dataFlex.type;
  let eloSoloq, lpSoloq, eloFlex, lpFlex;

  if (data.dataSoloq.tier === null || data.dataSoloq.division === null || data.dataSoloq.lp === null) {
    eloSoloq = 'Unranked';
    lpSoloq = '0';
  } else {
    eloSoloq = `${data.dataSoloq.tier} ${data.dataSoloq.division}`;
    lpSoloq = `${data.dataSoloq.lp} lp`;
  }

  if (data.dataFlex.tier === null || data.dataFlex.division === null || data.dataFlex.lp === null) {
    eloFlex = 'Unranked';
    lpFlex = '0';
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
      { name: `${nameSoloq}`, value: `${eloSoloq}  ${lpSoloq}` },
      { name: `${nameFlex}`, value: `${eloFlex}  ${lpFlex}` },
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
      const dataGeneral = 'https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name';
      const api_key = riotKey();
      const summoner_name = interaction.options.getString('summoner');
      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      const response = await axios.get(`${dataGeneral}/${summoner_name}`, {
        headers: {
          'X-Riot-Token': api_key,
        },
      });

      if (response.status === 200) {
        const summonerData = response.data;
        const name = summonerData.name;
        const level = summonerData.summonerLevel;
        const iconUrl = `http://ddragon.leagueoflegends.com/cdn/${versionActual}/img/profileicon/${summonerData.profileIconId}.png`;
        const finalData = await callSummonerData(name);
        const embed = createEmbed(name, level, iconUrl, finalData);
        await interaction.editReply({ embeds: [embed] });
      } else {
        console.error('Error al obtener datos del invocador.');
        await interaction.reply('Error al obtener datos del invocador.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  },
};