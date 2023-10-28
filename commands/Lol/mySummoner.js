const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { getSummoner } = require('../../utils/dbUtils');


const createEmbed = (name, level, iconUrl) => {
  const exampleEmbed = new EmbedBuilder()
    .setColor('#EAEE19')
    .setTitle(name)
    .setThumbnail(iconUrl)
    .addFields(
      { name: 'Level', value: `${level}`, inline: true },
    );
  return exampleEmbed;
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName('mi-invocador')
    .setDescription('tus datos de invocador'),
  async execute(interaction) {
    try {
      const dataGeneral = 'https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name';
      const api_key = riotKey();
      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      const discordId = interaction.user.id;
      const summoner_name = getSummoner(discordId);
      console.log(summoner_name);
      if (!summoner_name) {
        await interaction.reply('No tienes ningun invocador asociado a tu cuenta');
      } else {
        const response = await axios.get(`${dataGeneral}/${summoner_name.summoner}`, {
          headers: {
            'X-Riot-Token': api_key,
          },
        });

        if (response.status === 200) {
          const summonerData = response.data;
          const name = summonerData.name;
          const level = summonerData.summonerLevel;
          const iconUrl = `http://ddragon.leagueoflegends.com/cdn/${versionActual}/img/profileicon/${summonerData.profileIconId}.png`;
          const matchlistUrl = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${name}`;
          console.log(matchlistUrl);
          const embed = createEmbed(name, level, iconUrl);
          await interaction.reply({ embeds: [embed] });
        } else {
          console.error('error');
          await interaction.reply('Error al obtener datos del invocador.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }

  },
};