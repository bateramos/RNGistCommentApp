function fetchGist(token, gistId) {
  const headers = token ? { 'Authorization' : `token ${token}` } : {};

  return fetch(`https://api.github.com/gists/${gistId}`, { headers })
  .then(result => {
    if (result.status === 200) {
      return result.json();
    }

    return result.json().then(error => {
      throw new Error(JSON.stringify(error));
    });
  })
  .then(result => {
    const filesPromise = Object.keys(result.files).map(key => {
      return fetch(result.files[key].raw_url, { headers })
        .then(r => r.text())
        .then(fileContent => ({ text : fileContent, fileName : key }));
    });

    return Promise.all(filesPromise);
  });
}

function loadComments(token, gistId) {
  const headers = token ? { 'Authorization' : `token ${token}` } : {};

  return fetch(`https://api.github.com/gists/${gistId}/comments`, { headers })
    .then(result => {
      if (result.status === 200) {
        return result.json();
      }

      return result.json().then(error => {
        throw new Error(JSON.stringify(error));
      });
    });
}

function pushComment(token, gistId, comment) {
  const headers = { 'Authorization' : `token ${token}` };

  return fetch(`https://api.github.com/gists/${gistId}/comments`, {
    headers,
    body : JSON.stringify({ body : comment }),
    method : 'POST'
  })
  .then(result => {
    if (result.status === 201) {
      return { ok : true };
    }

    return result.json().then(error => {
      throw new Error(JSON.stringify(error));
    });
  });
}

export default {
  fetchGist,
  loadComments,
  pushComment
};