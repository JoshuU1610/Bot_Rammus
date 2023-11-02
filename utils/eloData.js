// const axios = require('axios');
// const { riotKey } = require('./riotApi');

// const eloData = (summonerData) => {
//   const url = `https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.summ_id}`;
//   const api_key = riotKey();
//   try {
//     const response = await axios.get(`${url}`, {
//         headers: {
//           'X-Riot-Token': api_key,
//         },
//       });
//     data = response.data;
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = { eloData };