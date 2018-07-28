// @flow
import express from 'express';
import bodyParser from 'body-parser'; // eslint-disable-line import/no-extraneous-dependencies
import database from './database';

const PORT: number = parseInt(process.env.PORT, 10) || 1337;

(async () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  try {
    await database.authenticate();
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  const listener = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    if (listener) console.log(`Listening on port ${listener.address().port}`);
  });
})();
