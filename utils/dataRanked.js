const axios = require('axios');
const { riotKey } = require('./riotApi');

const capitalizeFirstLetter = (str) => {
  if (str === null) {
    return 'Unranked';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};



const callSummonerData = async (summonerData) => {
  const url = `https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.summ_id}`;
  const api_key = riotKey();
  try {
    const response = await axios.get(`${url}`, {
      headers: {
        'X-Riot-Token': api_key,
      },
    });
    const dataRiot = response.data;
    const soloq = dataRiot[1];
    const flex = dataRiot[0];
    const dataSoloq = {
      type: 'Solo-Duo',
      tier: capitalizeFirstLetter(soloq.tier),
      division: soloq.rank,
      lp: soloq.leaguePoints,
      wins: soloq.wins,
      lose: soloq.losses

    };

    const dataFlex = {
      type: 'Flex',
      tier: capitalizeFirstLetter(flex.tier),
      division: flex.rank,
      lp: flex.leaguePoints,
      wins: flex.wins,
      lose: flex.losses
    };

    const finalData = {
      dataSoloq,
      dataFlex
    };
    return finalData;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};

module.exports = { callSummonerData };
