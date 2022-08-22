const generateRandomStateOrNonce=require('./generateStateAndNonce');
const generateTokens=require('./generateTokens');
const clientData=require('./data/client.json');
const path = require('path');
const express = require('express');
const app = express();
const redirectUri='http://localhost:3000/return'

const queryString = window.location.search;


app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});


const state=generateRandomStateOrNonce();
const nonce=generateRandomStateOrNonce();
let url;


//when frontend calls /authorurl
// you will generate a url and return it
app.get('/auth_url', (req, res) => {


    generateTokens().then((data)=>{
        verifier=data[0];
        challenge=data[1];
        if(verifier && challenge){
         url= buildAuthorizationUrl(clientData.id,challenge,redirectUri,state,nonce,clientData.allowedScopes)
         //console.log(url);
        res.redirect(url);
    }
    });

});

app.get('/return',(req,res)=>{
    res.send('{}');
    console.log(queryString);
    //console.log(urlparams.get(code));
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
