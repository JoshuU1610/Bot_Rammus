const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { riotKey } = require('../../utils/riotApi');
const { default: axios } = require('axios');

const createEmbed = (name, description, champUrl, title, atips, etips, tags) => {
  const exampleEmbed = new EmbedBuilder()
    .setColor('#EAEE19')
    .setTitle(name)
    .setDescription(title)
    .setThumbnail(champUrl)
    .addFields(
      { name: 'Tipo de campeon', value: `${tags}` },
      { name: 'Lore', value: `${description}` },
      { name: 'Tips para jugar con el', value: `${atips}` },
      { name: 'Tips para jugar contra el', value: `${etips}` },
    );
  return exampleEmbed;
};



module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-champs')
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
      const champion = interaction.options.getString('campeon');
      let championFormatted = '';

      if (champion) {
        const championWords = champion.split(' ');

        for (let i = 0; i < championWords.length; i++) {
          const word = championWords[i];

          if (i === 0) {
            championFormatted += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          } else {
            championFormatted += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
        }

        championFormatted = championFormatted.replace(/[^a-zA-Z0-9]+/g, '');

        if (championFormatted === 'NunuYWillump') {
          championFormatted = 'Nunu';
        }

        console.log('championFormatted (inside if):', championFormatted);
      }

      console.log('championFormatted (after if):', championFormatted);


      const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
      const versionActual = version.data[0];
      const verString = versionActual.toString();
      const dataGeneral = `http://ddragon.leagueoflegends.com/cdn/${verString}/data/es_MX/champion/${championFormatted}.json`;
      console.log(dataGeneral);
      const api_key = riotKey();
      const response = await axios.get(`${dataGeneral}`, {
        headers: {
          'X-Riot-Token': api_key,
        },
      });
      const dataChamp = response.data.data[championFormatted];
      console.log(dataChamp);
      const nameChamp = dataChamp.name;
      const imgChamp = `http://ddragon.leagueoflegends.com/cdn/13.21.1/img/champion/${dataChamp.image.full}`;
      const loreChamp = dataChamp.lore;
      const titleChamp = dataChamp.title;
      let allyTips = dataChamp.allytips;
      let enemyTips = dataChamp.enemytips;
      if (!allyTips || allyTips.length === 0) {
        allyTips = 'No hay información';
      }
      if (!enemyTips || enemyTips.length === 0) {
        enemyTips = 'No hay información';
      }
      const champTags = dataChamp.tags;
      const embed = createEmbed(nameChamp, loreChamp, imgChamp, titleChamp, allyTips, enemyTips, champTags);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      if (error.code === 'ERR_BAD_REQUEST') {
        await interaction.reply('Este campeon no existe');
      } else {
        await interaction.reply('error');
      }
    }
  },
};