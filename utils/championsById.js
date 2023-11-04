const { default: axios } = require('axios');
const { lastVersion } = require('./lastVersion');
const { riotKey } = require('./riotApi');

const championsByID = async () => {
  try {
    const version = await lastVersion();
    const dataGeneral = `http://ddragon.leagueoflegends.com/cdn/${version}/data/es_MX/champion.json`;
    const api_key = riotKey();
    const response = await axios.get(`${dataGeneral}`, {
      headers: {
        'X-Riot-Token': api_key,
      },
    });
    const champions = response.data.data;
    let data = [];

    for (const championKey in champions) {
      const champion = champions[championKey];
      data[data.length] = {
        id: champion.key,
        name: champion.name
      };
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { championsByID };