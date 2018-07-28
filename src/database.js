// @flow
import Sequelize from 'sequelize';

const DB_NAME = 'tong-its';
const DB_FILE = './.data/tong-its.db';

export default new Sequelize(DB_NAME, null, null, {
  dialect: 'sqlite',
  storage: DB_FILE,
});
