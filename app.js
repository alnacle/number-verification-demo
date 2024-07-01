const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const querystring = require('querystring');
const bodyParser = require('body-parser')

require('dotenv').config()


// URIs
const oidc_auth_uri = 'https://oidc.idp.vonage.com/oauth2/auth';
const camara_auth_uri = 'https://api-eu.vonage.com/oauth2/token';
const nv_uri = 'https://api-eu.vonage.com/camara/number-verification/v031/verify';

// load config from .env file
const jwt = process.env.JWT;
const client_id = process.env.VONAGE_APPLICATION_ID;
const redirect_uri = process.env.REDIRECT_URI;

let phoneNumber = "";

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
   .use(cors());

app.post('/login', function(req, res) {
  var state = generateRandomString(16);

  phoneNumber = req.body.phone;

  const scope = 'openid dpv:FraudPreventionAndDetection#number-verification-verify-read';

  const url =  oidc_auth_uri + '?' +
    querystring.stringify({
      client_id: client_id,
      response_type: 'code',
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      login_hint: "+".concat(phoneNumber)
    });

  res.send({"url": url});
});

app.get('/callback', async function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (!code || state === null) {
    const error = req.query.error_description || null;
    res.render('error', {error: error});
  } else {

    // Get CAMARA Access Token
    try {
      const data = {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + jwt
      }

      const response = await axios.post(camara_auth_uri, data, { headers: headers });
      access_token = response.data.access_token;

    } catch (error) {
      console.error(error);
      return;
    }

    // Number Verification API call
    try {
      const data = JSON.stringify({ phoneNumber: phoneNumber });

      const headers = { 
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + access_token 
      }

      const response = await axios.post(nv_uri, data, { headers: headers });

      if (response.data.devicePhoneNumberVerified == true) {
        res.render('success');
      } else {
        res.render('error', {error: ""});
      }

    } catch (error) {
      console.error(error);
    }

  }
});

console.log('Listening on 3000');
app.listen(3000);
