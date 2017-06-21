import { Buffer } from 'buffer/';

import config from './../.env.json';

const client_id = config.client_id;

function logout(username, password) {
  const userAuth = Buffer(`${username}:${password}`).toString('base64');

  return fetch('https://api.github.com/authorizations', {
    headers: { 'Authorization' : `Basic ${userAuth}` },
  })
  .then(result => {
    if (result.status === 200) {
      return result.json();
    }
  })
  .then(result => (result || []).find(auth => auth.app.client_id === client_id))
  .then(authorization => {
    if (authorization) {
      return removeAuthentication(authorization.id, userAuth);
    }

    throw new Error('This should not had happend! ' + JSON.stringify(authorization));
  });
}

function removeAuthentication(authroizationId, userAuth) {
  return fetch(`https://api.github.com/authorizations/${authroizationId}`, {
    method: 'DELETE',
    headers: { 'Authorization' : `Basic ${userAuth}` },
  });
}

function fetchToken(authroizationId, userAuth) {
  return removeAuthentication(authroizationId, userAuth)
  .then(() => loginWithAuth(userAuth))
  .then(result => {
    if (result.status === 201) {
      return result.json();
    }
    throw new Error('This should not had happend! ' + JSON.stringify(result));
  });
}

function loginWithAuth(userAuth) {
  return fetch(`https://api.github.com/authorizations/clients/${client_id}/Mobile`, {
    body: JSON.stringify({
      scopes : ['gist'],
      note : 'Gist Demo Comment',
      client_secret : config.client_secret
    }),
    headers: {
      'Authorization' : `Basic ${userAuth}`,
      'Accept' : 'application/vnd.github.v3+json'
    },
    method: 'PUT'
  });
}

function login(username, password) {
  const auth = Buffer(`${username}:${password}`).toString('base64');

  return loginWithAuth(auth).then(result => {
    if (result.status === 201) {
      return result.json();
    } else {
      return result.json().then(r => {
        return fetchToken(r.id, auth);
      });
    }
  })
  .then(result => {
    return { token : result.token, username };
  });
}

export default {
  login,
  logout,
};