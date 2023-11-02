const db = require('./index');

const createUsersTable = async () => {
  try {

    const statementDropTable = `
    DROP TABLE IF EXISTS summoner
    `;

    db.prepare(statementDropTable).run();

    const statementCreatesummonerTable = `
    CREATE TABLE IF NOT EXISTS summoner (
      user_id TEXT PRIMARY KEY,
      summoner TEXT NOT NULL,
      summ_id TEXT NOT NULL,
      puuid_id TEXT NOT NULL,
      account_Id TEXT NOT NULL
    );    
    `;
    const createsummonerTable = db.prepare(statementCreatesummonerTable);
    createsummonerTable.run();
  } catch (error) {
    console.log(error);
    throw new Error('Erro con el SQL');
  }
};


const createTables = async () => {
  try {
    console.log('Creando tablas...');
    await createUsersTable();
    console.log('Tabla de invocadores creada');
  } catch (error) {
    console.log('Se acabo');
  }
};

createTables();