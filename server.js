require('dotenv').config();
const fs = require('fs');
const qs = require('querystring');
const express = require('express');
const { parse } = require('url');
const next = require('next');
const TeleSignSDK = require('telesignsdk');
const uuid = require('uuid/v1');
const _ = require('lodash');
const Promise = global.Promise = require('bluebird');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || `http://localhost`;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const phone_numbers_to_send_to = new Set();
const unsubscribe_codes = new Map();

const facts = fs.readFileSync('./facts.txt', {
  encoding: 'utf8',
}).split('\n');


console.log(
  process.env.TELESIGN_CUSTOMER_ID,
  process.env.TELESIGN_API_KEY,
);

const telesign = new TeleSignSDK(
  process.env.TELESIGN_CUSTOMER_ID,
  process.env.TELESIGN_API_KEY,
  'https://rest-api.telesign.com',
);


app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());

    server.post('/api/subscribe', (req, res) => {
      console.log(req.body);
      if (!req.body || !req.body.phone) {
        return res.status(400).end();
      }
      phone_numbers_to_send_to.add(req.body.phone);
      unsubscribe_codes.set(uuid(), req.body.phone);
      return res.status(200).end();
    });

    server.post('/api/unsubscribe', (req, res) => {
      console.log(req.body);
      const phone = unsubscribe_codes.get(req.body.code);
      console.log(phone);
      if (!req.body || !phone || !phone_numbers_to_send_to.has(phone)) {
        res.status(400).end();
      }
      phone_numbers_to_send_to.delete(phone);
      res.status(200).end();
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  ;

const send_fact_to_phone = phone => new Promise((resolve, reject) => {
  console.log(`Sending cat fact to "${phone}"`);
  let unsubscribe_code;
  for (let [code, code_phone] of unsubscribe_codes) {
    if (code_phone === phone) {
      unsubscribe_code = code;
      break;
    }
  }
  if (!unsubscribe_code) {
    console.log(`Couldn't find unsubscribe code for ${phone}`);
    return;
  }
  telesign.sms.message(
    (err, res) => {
      console.log(err);
      console.log(res);
      resolve();
    },
    phone,
    `Did you know? ${_.sample(facts)} To unsubscribe, please visit ${HOST}/unsubscribe?${qs.stringify({
      code: unsubscribe_code,
    })}`,
    'ARN',
  );
});

setInterval(() => {
  console.log('Start sending');
  Promise.map(phone_numbers_to_send_to, async phone => {
    await send_fact_to_phone(phone);
    await Promise.delay(1500);
  }, { concurrency: 1 });
  phone_numbers_to_send_to.forEach(phone => {
  });
  console.log('Stop sending');
}, process.env.INTERVAL || 1000 * 60 * 1 / 2);
