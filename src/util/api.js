import axios from 'axios';

// anime streaming site
const funiApiHost = "https://prod-api-funimationnow.dadcdigital.com/api/";
const crunchyApiHost = "https://api.crunchyroll.com/";

function crunchyGet(path, config) {
  return axios.get(
    crunchyApiHost + `${path}.0.json`, config
  );
}

function funiGet(path, config) {
  return axios.get(
    funiApiHost + `${path}`, config
  );
}

export { crunchyGet, funiGet };