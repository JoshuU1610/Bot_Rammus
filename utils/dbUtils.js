const db = require('../database');


const getSummoner = (id) => {
  const searchstatment = `
        SELECT * FROM summoner
        WHERE user_id = ?
    `;
  const user = db.prepare(searchstatment).get(id);
  return user;
};

module.exports = { getSummoner };