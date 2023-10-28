const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');


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
    .setName('buscar-invocador')
    .setDescription('Te da los datos de invocador')
    .addStringOption(option =>
      option
        .setName('summoner')
        .setDescription('nombre de invocador')
        .setRequired(true)
    ),
  async execute(interaction) {
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
        const matchlistUrl = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${name}`;
        console.log(matchlistUrl);
        const embed = createEmbed(name, level, iconUrl);
        await interaction.reply({ embeds: [embed] });
      } else {
        console.error('Error al obtener datos del invocador.');
        await interaction.reply('Error al obtener datos del invocador.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  },
};