// @flow
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import database from './database';

const PORT: number = parseInt(process.env.PORT, 10) || 1337;
(bodyParser: *);

(async () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  try {
    await database;
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  const listener = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    if (listener) console.log(`Listening on port ${listener.address().port}`);
  });
})();
