const { default: axios } = require('axios');
const { riotKey } = require('./riotApi');

const allMatches = async (summonerData) => {
  try {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerData.puuid_id}/ids`;
    const api_key = riotKey();
    const response = await axios.get(`${url}`, {
      headers: {
        'X-Riot-Token': api_key,
      },
    });
    const matches = response.data;
    return matches;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { allMatches };