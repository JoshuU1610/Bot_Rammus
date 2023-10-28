const axios = require('axios');
const cheerio = require('cheerio');

const username = 'NombreDeUsuario'; // Reemplaza con el nombre de usuario que deseas buscar

const url = `https://na.op.gg/summoner/userName=${username}`;

axios.get(url)
  .then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      // Ejemplo de extracción de información, como el nombre del jugador
      const player_name = $('.Summoner').text().trim();

      // Puedes agregar más lógica para extraer la información que necesites

      console.log(`Nombre del jugador: ${player_name}`);
    } else {
      console.error(`Error al acceder a la página. Código de estado: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Error en la solicitud HTTP: ${error.message}`);
  });
