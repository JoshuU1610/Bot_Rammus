const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { getSummoner } = require('../../utils/dbUtils');
const { callSummonerData } = require('../../utils/dataOpgg');

const createEmbed = (name, level, iconUrl, data) => {
  console.log(data);
  const nameSoloq = data.dataSoloq.type;
  const nameFlex = data.dataFlex.type;
  const eloSoloq = `${data.dataSoloq.tier} ${data.dataSoloq.division}`;
  const lpSoloq = `${data.dataSoloq.lp} lp`;
  const eloFlex = `${data.dataFlex.tier} ${data.dataFlex.division}`;
  const lpFlex = `${data.dataFlex.lp} lp`;
  const exampleEmbed = new EmbedBuilder()
    .setColor('#EAEE19')
    .setTitle(name)
    .setThumbnail(iconUrl)
    .addFields(
      { name: 'Level', value: `${level}`, inline: true },
      { name: `${nameSoloq}`, value: `${eloSoloq}`, inline: true },
      { name: 'LP', value: `${lpSoloq}`, inline: true },
      { name: `${nameFlex}`, value: `${eloFlex}`, inline: true },
      { name: 'LP', value: `${lpFlex}`, inline: true },
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
        const finalData = await callSummonerData(summoner_name.summoner);
        const embed = createEmbed(name, level, iconUrl, finalData);

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
