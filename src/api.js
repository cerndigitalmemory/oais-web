import { getCookie } from '@/utils.js';
import axios from 'axios';

// Base endpoint where the API is served
export const API_URL = '/api/';

/**
 * Provides functions to consume the oais-platform API
 *
 */

// Set the CSRF token in the X-CSRFToken header
// Check https://django.readthedocs.io/en/stable/ref/csrf.html#ajax
// for more information on the implemented flow
function addCSRFToken(options) {
  const CSRFToken = getCookie('csrftoken');

  if (!CSRFToken) {
    return options;
  }

  options.headers ??= {};
  options.headers['X-CSRFToken'] = CSRFToken;
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
        detail = response.non_field_errors.join('\n');
      }
      throw new Error(detail);
    }
  }

  async _get(url, options = {}) {
    options = addCSRFToken(options);
    const { data: response } = await API.handleError(
      async () => await this.client.get(url, options)
    );
    return response;
  }

  async _post(url, data = {}, options = {}) {
    options = addCSRFToken(options);
    const { data: response } = await API.handleError(
      async () => await this.client.post(url, data, options)
    );
    return response;
  }

  async _patch(url, data = {}, options = {}) {
    options = addCSRFToken(options);
    const { data: response } = await API.handleError(
      async () => await this.client.patch(url, data, options)
    );
    return response;
  }

  async login(username, password) {
    return await this._post('/login/', {
      username: username,
      password: password,
    });
  }

  async logout() {
    return await this._post('/logout/');
  }

  async search(source, query, page, size) {
    return await this._get(`/search/${source}/`, {
      params: { q: query, p: page, s: size },
    });
  }

  async search_by_id(source, id) {
    return await this._get(`/search/${source}/${id}/`);
  }

  async internal_search(searchQuery, searchAgg) {
    return await this._post(`/search-query/`, {
      query: { query_string: { query: searchQuery }, from: 0 },
      aggs: { terms: { field: searchAgg } },
    });
  }

  async harvest(source, recid) {
    return await this._post(`/harvest/${recid}/${source}/`);
  }

  async archive_details(id) {
    return await this._get(`/archive-details/${id}`);
  }

  async next_step(step_no, archive) {
    return await this._post(`archive/next-step`, {
      next_step: step_no,
      archive: archive,
    });
  }

  async ingest(file) {
    var formData = new FormData();
    formData.append('file', file);
    return await this._post(`/upload/`, formData);
  }

  async archives(page = 1) {
    return await this._get('/archives/', { params: { page } });
  }

  async archivesByUser(id, page = 1) {
    return await this._get(`/users/${id}/archives/`, { params: { page } });
  }

  async get_archive_steps(id) {
    return await this._get(`/archive/${id}/`);
  }

  async user(id) {
    return await this._get(`/users/${id}/`);
  }

  async settings() {
    return await this._get('/settings/');
  }

  async approveArchive(id) {
    return await this._post(`/steps/${id}/actions/approve/`);
  }

  async rejectArchive(id) {
    return await this._post(`/steps/${id}/actions/reject/`);
  }

  async me() {
    return await this._get(`/me/`);
  }
}

export const api = new API({
  baseURL: API_URL,
});
