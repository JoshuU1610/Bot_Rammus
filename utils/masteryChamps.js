const { default: axios } = require('axios');
const { riotKey } = require('./riotApi');
const { championsByID } = require('./championsById');

const masteryChampsSummoner = async (summ_id) => {
  try {
    const api_key = riotKey();
    const url = `https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summ_id}`;
    const response = await axios.get(`${url}`, {
      headers: {
        'X-Riot-Token': api_key,
      },
    });
    const data = response.data;
    const championsData = await championsByID();
    let finaldata = [];

    for (let i = 0; i < 3; i++) {
      const e1 = data[i];
      for (let e = 0; e < championsData.length; e++) {
        const e2 = championsData[e];
        let a = e1.championId;
        let b = e2.id;
        a = a.toString();
        b = b.toString();
        if (a === b) {
          finaldata[i] = {
            champion: e2.name,
            mastery: e1.championLevel,
            points: e1.championPoints
          };
        }
      }
    }

    return finaldata;

  } catch (error) {
    console.log(error);
  }
};

module.exports = { masteryChampsSummoner };