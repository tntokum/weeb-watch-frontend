import axios from 'axios';

function get(url, path, config) {
  return axios.get(
    `${url}${path}`, config
  );
}

export { get };