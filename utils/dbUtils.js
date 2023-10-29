const db = require('../database');


const getSummoner = async (id) => {
  const searchstatment = `
        SELECT * FROM summoner
        WHERE user_id = ?
    `;
  const user = await db.prepare(searchstatment).get(id);
  return user;
};

module.exports = { getSummoner };