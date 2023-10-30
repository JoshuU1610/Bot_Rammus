const axios = require('axios');

const callSummonerData = async (summoner) => {
  const url = `https://www.op.gg/_next/data/K4R8Ttdg6rFA2Yod21Vgy/en_US/summoners/lan/${summoner}.json?region=lan&summoner=${summoner}`;
  try {
    const response = await axios.get(url);
    const summonerDataOPGG = response.data;
    const soloq = summonerDataOPGG.pageProps.data.league_stats[0];
    const flex = summonerDataOPGG.pageProps.data.league_stats[1];
    const dataSoloq = {
      type: soloq.queue_info.queue_translate,
      tier: soloq.tier_info.tier,
      division: soloq.tier_info.division,
      lp: soloq.tier_info.lp,
      division_img: soloq.tier_info.tier_image_url,
      win: soloq.win,
      lose: soloq.lose
    };
    const dataFlex = {
      type: flex.queue_info.queue_translate,
      tier: flex.tier_info.tier,
      division: flex.tier_info.division,
      lp: flex.tier_info.lp,
      division_img: flex.tier_info.tier_image_url,
      win: flex.win,
      lose: flex.lose
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
