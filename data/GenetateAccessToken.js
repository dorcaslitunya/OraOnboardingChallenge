'use strict';
//Client must make sure that the certificate is in the src folder that is together with this index,js file
//Else they can change the variable defined as 'const PATH_TO_PEM_CERT ' to relevant values.




/** 
 * This sample generates a short lived client JWT for use on Stitch SSO's token
 * endpoint. To run this sample, please run npm install, and then 
 * `npm run generate-jwt -- $CLIENT_ID $PATH_TO_PEM_CERT` where $CLIENT_ID is the 
 *  client id that was provided to you, and $PATH_TO_PEM_CERT is a path to the 
 *  cert that was provided to you in the confidential client
 */

const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto"); // used for generating the cryptographically unique JWT id
const clientData=require("./client.json");
const { builtinModules } = require('module');

const CLIENT_ID= clientData.id;
const PATH_TO_PEM_CERT="./data/certificate.pem";

//Setting the commandLine arguments values to the client id and perm cert
process.argv[2]=CLIENT_ID;
process.argv[3]=PATH_TO_PEM_CERT;

console.log(process.argv);
if (process.argv.length < 4) {
  console.error('Expected command line argument to contain first your client id and then the path to your PEM certificate');
  return;
}

// Client id is the second to last argument 
const clientId = process.argv[process.argv.length - 2];


// Assume filename comes last
const filename = process.argv[process.argv.length - 1];


console.log('Generating private_key_jwt for certificate ', filename);

const pemCert = fs.readFileSync(filename).toString('utf-8');

function getKeyId(cert) {
  const lines = cert.split('\n').filter(x => x.includes('localKeyID:'))[0];
  const result = lines.replace('localKeyID:', '').replace(/\W/g, '');
  return result;
}

const issuer = clientId;
const subject = clientId;
const audience = 'https://secure.stitch.money/connect/token';
const keyid = getKeyId(pemCert);
const jwtid = crypto.randomBytes(16).toString("hex");

const options = {
  keyid,
  jwtid,
  notBefore: "0",
  issuer,
  subject,
  audience,
  expiresIn: "5m", // For this example this value is set to 5 minutes, but for machine usage should generally be a lot shorter 
  algorithm: "RS256"
};

const token = jwt.sign({}, pemCert, options);
console.log(`Token:\n${token}`);

module.exports.token=token;


