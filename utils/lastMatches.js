//summonername y win(bool)
const { default: axios } = require('axios');
const { allMatches } = require('./allMatches');
const { riotKey } = require('./riotApi');

const lastMatches = async (summonerData) => {
  try {
    const matches = await allMatches(summonerData);
    const api_key = riotKey();
    for (let i = 0; i < 5; i++) {
      const element = matches[i];
      const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${element}`;
      const response = await axios.get(`${url}`, {
        headers: {
          'X-Riot-Token': api_key,
        },
      });
      const matchData = response.data;
      console.log(matchData.info.participants);
      //entrar en cada posicion
    }
    return matches;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { lastMatches };