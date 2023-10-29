const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { getSummoner } = require('../../utils/dbUtils');
const { JSDOM } = require('jsdom');

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

const callSummonerData = async (summoner) => {
  const url = `https://www.op.gg/summoners/lan/${summoner}`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    // Crear un documento JSDOM para analizar el HTML
    const { window } = new JSDOM(html);
    const document = window.document;
    // Supongamos que deseas extraer el nombre del invocador, que se encuentra en un elemento con una clase específica.
    const summonerName = document.querySelector('.tier').textContent; // Reemplaza '.summoner-name' con el selector correcto.
    console.log('Nombre del invocador:', summonerName);
  } catch (error) {
    console.error('Error al realizar la solicitud HTTP:', error);
  }
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
      console.log(discordId);

      // Añadir comprobación para verificar si summoner_name es válido.
      const summoner_name = await getSummoner(discordId);
      callSummonerData(summoner_name);
      console.log(summoner_name);

      if (!summoner_name) {
        await interaction.reply('No tienes ningún invocador asociado a tu cuenta');
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
        const embed = createEmbed(name, level, iconUrl);

        // Respondiendo con el embed creado.
        await interaction.reply({ embeds: [embed] });
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
