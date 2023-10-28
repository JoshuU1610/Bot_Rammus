const { SlashCommandBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { default: axios } = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-campeon')
    .setDescription('Busca cualquier campeon')
    .addStringOption(
      Option =>
        Option
          .setName('campeon')
          .setDescription('Escribe el nombre de algun campeon')
          .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const champion = `${interaction.options.getString('campeon')}.json`;
      console.log(champion);
      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      console.log(versionActual);
      const dataGeneral = `http://ddragon.leagueoflegends.com/cdn/${versionActual}/data/es_MX/champion/`;
      const api_key = riotKey();
      const response = await axios.get(`${dataGeneral}/${champion}`, {
        headers: {
          'X-Riot-Token': api_key,
        },
      });
      console.log(response);
      if (response.status === 200) {
        const champData = response.data;
        console.log(champData);
        // const embed = createEmbed(name, level, iconUrl);
        await interaction.reply('vas bien');
      } else {
        console.error('Error al obtener datos del invocador.');
        await interaction.reply('Error al obtener datos del invocador.');
      }

    } catch (error) {
      console.log(error);
      await interaction.reply('hubo un error');
    }
  },
};