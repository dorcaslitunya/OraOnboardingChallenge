const crypto = require('crypto');
const btoa=require('btoa');

function base64UrlEncode(byteArray) {
    const charCodes = String.fromCharCode(...byteArray);
    return btoa(charCodes)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
async function sha256(verifier) {
    const msgBuffer = new TextEncoder('utf-8').encode(verifier);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return new Uint8Array(hashBuffer);
}
async function generateVerifierChallengePair() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const verifier = base64UrlEncode(randomBytes);
  console.log('Verifier:', verifier);
  const challenge = await sha256(verifier).then(base64UrlEncode);
  console.log('Challenge:', challenge)
  return [verifier, challenge];
}
const tokens=generateVerifierChallengePair();