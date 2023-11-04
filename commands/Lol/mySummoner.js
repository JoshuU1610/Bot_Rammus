const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { getSummoner } = require('../../utils/dbUtils');
const { callSummonerData } = require('../../utils/dataRanked');
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
    .setName('mi-invocador')
    .setDescription('tus datos de invocador'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const dataGeneral = 'https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name';
      const api_key = riotKey();
      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      const discordId = interaction.user.id;
      const summoner_name = await getSummoner(discordId);
      const champ = await masteryChampsSummoner(summoner_name.summ_id);

      if (!summoner_name) {
        await interaction.editReply('No tienes ningún invocador asociado a tu cuenta');
      } else {
        const response = await axios.get(`${dataGeneral}/${summoner_name.summoner}`, {
          headers: {
            'X-Riot-Token': api_key,
          },
        });
        const summonerData = response.data;
        const name = summonerData.name;
        const level = summonerData.summonerLevel;
        const iconUrl = `http://ddragon.leagueoflegends.com/cdn/${versionActual}/img/profileicon/${summonerData.profileIconId}.png`;
        const finalData = await callSummonerData(summoner_name);
        const embed = createEmbed(name, level, iconUrl, finalData,champ);
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);

      // Agregar manejo de errores para Axios.
      if (error.isAxiosError) {
        if (error.response) {
          console.error('Respuesta de la API:', error.response.status, error.response.statusText);
        } else {
          console.error('No se pudo conectar a la API');
        }
      }
    }
  },
};
