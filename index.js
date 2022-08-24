const generateRandomStateOrNonce=require('./generateStateAndNonce');
const generateTokens=require('./generateTokens');
const clientData=require('./data/client.json');
const path = require('path');
const express = require('express');
const app = express();
const redirectUri='http://localhost:3000/return'
const generateClientAssertion=require('./GenerateAccessToken');
const { emitWarning } = require('process');
const ClientToken=retrieveTokenUsingClientAssertion(clientData.id,generateClientAssertion.token, '');

//const queryString = window.location.search;


app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});


const state=generateRandomStateOrNonce();
const nonce=generateRandomStateOrNonce();





//when frontend calls /authorurl
// you will generate a url and return it
let verifier,challenge;
app.get('/auth_url', (req, res) => {
    
    console.log('123103132')
    const start=async function() {
        [verifier,challenge]=await generateTokens.generateTokens();
        if(verifier && challenge){
            const url= buildAuthorizationUrl(clientData.id,challenge,redirectUri,state,nonce,clientData.allowedScopes)
            
            res.redirect(url);
           
         //console.log(res);
    };      
    }
    start();

    //const responseUrl=new URL(res)
   
    });


app.get('/return',(req,res)=>{
  const code=req.query.code;
  retrieveTokenUsingAuthorizationCode(clientData.id,redirectUri,verifier,code,generateClientAssertion.token);
 
 
});

app.listen(3000, () => {
    console.log('Application listening on port 3000!');
});




function buildAuthorizationUrl(clientId, challenge, redirectUri, state, nonce, scopes) {
    const search = {
          client_id: clientId,
          code_challenge: challenge,
          code_challenge_method: 'S256',
          redirect_uri: redirectUri,
          scope: scopes.join(' '),
          response_type: 'code',
          nonce: nonce,
          state: state
    };
    const searchString = Object.entries(search).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return `https://secure.stitch.money/connect/authorize?${searchString}`;
  }


  async function retrieveTokenUsingClientAssertion(clientId, clientAssertion, scopes) {
    const body = {
        grant_type: 'client_credentials',
        client_id: clientId,
        scope: 'transactions',
        audience: 'https://secure.stitch.money/connect/token',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion
    };
    // console.log(scopes);
    const bodyString = Object.entries(body).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const response = await fetch('https://secure.stitch.money/connect/token', {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyString,
    });
    const responseBody = await response.json();
    // console.log('Tokens: ',  responseBody);
    return responseBody;
}

async function retrieveTokenUsingAuthorizationCode(clientId, redirectUri, verifier, code, clientAssertion) {
    const body = {
        grant_type: 'authorization_code',
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
        client_assertion: clientAssertion,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
    }
    const bodyString = Object.entries(body).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const response = await fetch('https://secure.stitch.money/connect/token', {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyString,
    });
    const responseBody = await response.json();
    console.log('Tokens: ',  responseBody);
    return responseBody;
}
