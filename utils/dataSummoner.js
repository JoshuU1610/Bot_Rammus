const axios = require('axios');
const { riotKey } = require('./riotApi');

const summonerData = async (summoner) => {
  const url = `https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`;
  const api_key = riotKey();
  try {
    const response = await axios.get(`${url}`, {
      headers: {
        'X-Riot-Token': api_key,
      },
    });
    const summonerData = response.data;
    const data = {
      name: summonerData.name,
      level: summonerData.summonerLevel,
      icon: summonerData.profileIconId,
      summ_id: summonerData.id,
      accountid: summonerData.accountId,
      puuid: summonerData.puuid
    };
    return data;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};

module.exports = { summonerData };