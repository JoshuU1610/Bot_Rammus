const axios = require('axios');
const cheerio = require('cheerio');

const getDataSummoner = async (username) => {
  const url = `https://www.op.gg/summoners/lan/${username}`;
  const response = await axios.get(url);
  if (response.status === 200) {
    const html = response.data;
    const $ = cheerio.load(html);
    console.log($);
    // Ejemplo de extracción de información, como el nombre del jugador
    // const player_name = $('.Summoner').text().trim();

    // Puedes agregar más lógica para extraer la información que necesites

    // console.log(`Nombre del jugador: ${player_name}`);
  } else {
    console.error(`Error al acceder a la página. Código de estado: ${response.status}`);
  }
};

module.exports = { getDataSummoner };
