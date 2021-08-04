'use strict';

const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://dev-3zy4mv8n.us.auth0.com/.well-known/jwks.json'
});

module.exports = (header, callback) => {
  client.getSigningKey(header.kid, function(err, key) {
    let signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
