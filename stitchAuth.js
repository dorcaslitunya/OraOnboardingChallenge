//Hardcoded:redirectUri

const generateTokens = require('./generateTokens');
var verifier, challenge;
const start=(async function start() {
    [verifier, challenge] = await generateTokens.generateTokens();

    
})();
const generateRandomStateOrNonce = require('./generateStateAndNonce');

const clientData = require('./data/client.json');
const redirectUri = 'http://localhost:3000/return'


console.log(verifier);



class StitchAuth{
    constructor(clientId){
        this.clientId=clientId
        this.state = generateRandomStateOrNonce();
        this.nonce = generateRandomStateOrNonce();
        this.scopes=(clientData.allowedScopes).join(' ');
    }
    
       
   buildAuthorizationUrl () {
      
        const search = {
            client_id: this.clientId,
            code_challenge: challenge,
            code_challenge_method: 'S256',
            redirect_uri: redirectUri,
            scope: this.scopes,
            response_type: 'code',
            nonce: this.nonce,
            state: this.state
        };
        const searchString = Object.entries(search).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    
    return `https://secure.stitch.money/connect/authorize?${searchString}`;

    }





}

let trials=new StitchAuth(clientData.id);
const seee=trials.buildAuthorizationUrl();
console.log(seee);
console.log(verifier);
