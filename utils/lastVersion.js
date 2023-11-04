const { default: axios } = require('axios');

const lastVersion = async () => {
  const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  const versionActual = version.data[0];
  const verString = versionActual.toString();
  return verString;
};

module.exports = { lastVersion };