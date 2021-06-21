import axios from "axios";

const API_URL = "/";

class API {
  constructor(config) {
    this.client = axios.create(config);
  }

  search(source, query) {
    return this.client
      .get(`/search/${source}`, { params: { q: query } })
      .then((res) => res.data);
  }

  harvest(source, recid) {
    return this.client
      .get(`/harvest/${recid}/${source}`)
      .then((res) => res.data);
  }
}

export let api = new API({
  baseURL: API_URL,
});
