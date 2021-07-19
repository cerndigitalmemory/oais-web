import { Storage } from "@/storage.js";
import axios from "axios";

const API_URL = "/";

function addAuthorizationHeader(options) {
  const token = Storage.getToken();
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

  static async handleError(request) {
    try {
      return await request();
    } catch (e) {
      let detail = e.message;
      const response = e.response?.data;
      if (response?.detail) {
        detail = response.detail;
      } else if (response?.non_field_errors) {
        detail = response.non_field_errors.join("\n");
      }
      throw new Error(detail);
    }
  }

  async _get(url, options = {}) {
    options = addAuthorizationHeader(options);
    const { data: response } = await API.handleError(
      async () => await this.client.get(url, options)
    );
    return response;
  }

  async _post(url, data = {}, options = {}) {
    options = addAuthorizationHeader(options);
    const { data: response } = await API.handleError(
      async () => await this.client.post(url, data, options)
    );
    return response;
  }

  async _patch(url, data = {}, options = {}) {
    options = addAuthorizationHeader(options);
    const { data: response } = await API.handleError(
      async () => await this.client.patch(url, data, options)
    );
    return response;
  }

  async login(username, password) {
    return await this._post("/auth/", {
      username: username,
      password: password,
    });
  }

  async search(source, query) {
    return await this._get(`/search/${source}/`, { params: { q: query } });
  }

  async harvest(source, recid) {
    return await this._post(`/harvest/${recid}/${source}/`);
  }

  async archives(page = 1) {
    return await this._get("/archives/", { params: { page } });
  }

  async archivesByRecord(id, page = 1) {
    return await this._get(`/records/${id}/archives/`, { params: { page } });
  }

  async archivesByUser(id, page = 1) {
    return await this._get(`/users/${id}/archives/`, { params: { page } });
  }

  async record(id) {
    return await this._get(`/records/${id}/`);
  }

  async user(id) {
    return await this._get(`/users/${id}/`);
  }

  async approveArchive(id) {
    return await this._post(`/archives/${id}/actions/approve/`);
  }

  async rejectArchive(id) {
    return await this._post(`/archives/${id}/actions/reject/`);
  }

  async me() {
    return await this._get(`/me/`);
  }
}

export const api = new API({
  baseURL: API_URL,
});
