import axios from "axios";
import { getToken } from "./storage.js";
import { ArchiveStatus } from "./utils.js";

const API_URL = "/";

function addAuthorizationHeader(options) {
  const token = getToken();
  if (token !== null) {
    if (options.headers === undefined) {
      options.headers = {};
    }
    options.headers["Authorization"] = `Token ${token}`;
  }
  return options;
}

class API {
  constructor(config) {
    this.client = axios.create(config);
  }

  _get(url, options = {}) {
    options = addAuthorizationHeader(options);
    return this.client.get(url, options).then((res) => res.data);
  }

  _post(url, data = {}, options = {}) {
    options = addAuthorizationHeader(options);
    return this.client.post(url, data, options).then((res) => res.data);
  }

  _patch(url, data = {}, options = {}) {
    options = addAuthorizationHeader(options);
    return this.client.patch(url, data, options).then((res) => res.data);
  }

  login(username, password) {
    return this._post("/auth/", {
      username: username,
      password: password,
    });
  }

  search(source, query) {
    return this._get(`/search/${source}/`, { params: { q: query } });
  }

  harvest(source, recid) {
    return this._post(`/harvest/${recid}/${source}/`);
  }

  archives(page = 1) {
    return this._get("/archives/", { params: { page } });
  }

  archivesByRecord(id, page = 1) {
    return this._get(`/records/${id}/archives/`, { params: { page } });
  }

  archivesByUser(id, page = 1) {
    return this._get(`/users/${id}/archives/`, { params: { page } });
  }

  record(id) {
    return this._get(`/records/${id}/`);
  }

  user(id) {
    return this._get(`/users/${id}/`);
  }

  patchArchive(id, data) {
    return this._patch(`/archives/${id}/`, data);
  }

  approveArchive(id) {
    return this.patchArchive(id, { status: ArchiveStatus.PENDING });
  }

  rejectArchive(id) {
    return this.patchArchive(id, { status: ArchiveStatus.REJECTED });
  }
}

export const api = new API({
  baseURL: API_URL,
});
