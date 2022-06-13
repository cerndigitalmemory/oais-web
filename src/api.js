import { getCookie } from '@/utils.js'
import axios from 'axios'
import { AppContext } from '@/AppContext.js'
import { sendNotification } from '@/utils.js'

// Base endpoint where the API is served
export const API_URL = '/api/'

/**
 * Provides functions to consume the oais-platform API
 *
 */

// Set the CSRF token in the X-CSRFToken header
// Check https://django.readthedocs.io/en/stable/ref/csrf.html#ajax
// for more information on the implemented flow
function addCSRFToken(options) {
  const CSRFToken = getCookie('csrftoken')

  if (!CSRFToken) {
    return options
  }

  options.headers ??= {}
  options.headers['X-CSRFToken'] = CSRFToken
  options.mode = 'same-origin'
  return options
}

class API {
  constructor(config) {
    this.client = axios.create(config)
  }
  static contextType = AppContext.Context

  static async handleError(request) {
    try {
      return await request()
    } catch (e) {
      let detail = e.message
      const response = e.response?.data
      if (e.response) {
        // If the user tries to access a link that has no access, log him out
        // TODO: If the user tries to access a link that has no access, redirect to a show permission error page
        if (e.response.status == 403) {
          AppContext.logout()
        } else if (e.message == 'Network Error') {
          sendNotification(
            'Cannot connect to the server. Check your network connection.',
            e.message,
            'error'
          )
        }
      }
      if (response?.detail) {
        detail = response.detail
      } else if (response?.non_field_errors) {
        detail = response.non_field_errors.join('\n')
      }
      throw new Error(detail)
    }
  }

  async _get(url, options = {}) {
    options = addCSRFToken(options)
    const { data: response } = await API.handleError(
      async () => await this.client.get(url, options)
    )
    return response
  }

  async _post(url, data = {}, options = {}) {
    options = addCSRFToken(options)
    const { data: response } = await API.handleError(
      async () => await this.client.post(url, data, options)
    )
    return response
  }

  async _patch(url, data = {}, options = {}) {
    options = addCSRFToken(options)
    const { data: response } = await API.handleError(
      async () => await this.client.patch(url, data, options)
    )
    return response
  }

  async login(username, password) {
    return await this._post('/login/', {
      username: username,
      password: password,
    })
  }

  async logout() {
    return await this._post('/logout/')
  }

  async search(source, query, page, size) {
    return await this._get(`/search/${source}/`, {
      params: { q: query, p: page, s: size },
    })
  }

  async search_by_id(source, id) {
    return await this._get(`/search/${source}/${id}/`)
  }

  // async internal_search(searchQuery, searchAgg) {
  //   return await this._post(`/search-query/`, {
  //     query: { query_string: { query: searchQuery }, from: 0 },
  //     aggs: { terms: { field: searchAgg } },
  //   })
  // }

  async harvest(id) {
    return await this._post(`/harvest/${id}/`)
  }

  // async createArchive(source, recid) {
  //   return await this._post(`/create-archive/${recid}/${source}/`)
  // }

  async createStagedArchive(records) {
    return await this._post(`/create-staged-archive/`, { records: records })
  }

  // async setTag(id, tags) {
  //   return await this._post(`/records/${id}/actions/set/`, { tags: tags })
  // }

  async parse_url(url) {
    return await this._post('/parse-url/', { url: url })
  }

  async archive_details(id) {
    return await this._get(`/archive-details/${id}`)
  }

  async next_step(step_no, archive) {
    return await this._post(`archive/next-step`, {
      next_step: step_no,
      archive: archive,
    })
  }

  async ingest(file) {
    var formData = new FormData()
    formData.append('file', file)
    return await this._post(`/upload/`, formData)
  }

  async archives(page = 1, filter = 'public') {
    return await this._get('/archives/', { params: { page, filter } })
  }

  async stagedArchives() {
    return await this._get('/staged-archives/')
  }

  async stagedArchivesPaginated(page) {
    return await this._get('/staged-archives-paginated/', { params: { page } })
  }

  async archivesByUser(id, page = 1) {
    return await this._get(`/users/${id}/archives/`, { params: { page } })
  }

  async archivesByUserStaged(id, page = 1) {
    return await this._get(`/users/${id}/archives-staged/`, {
      params: { page },
    })
  }

  async get_archive_details(archives) {
    return await this._post(`/get-detailed/`, { archives: archives })
  }

  async get_archive_steps(id) {
    return await this._get(`/archive/${id}/`)
  }

  async user(id) {
    return await this._get(`/users/${id}/`)
  }

  async settings() {
    return await this._get('/settings/')
  }

  async approveArchive(id) {
    return await this._post(`/steps/${id}/actions/approve/`)
  }

  async rejectArchive(id) {
    return await this._post(`/steps/${id}/actions/reject/`)
  }

  async collections(page = 1, internal) {
    return await this._get('/collections/', { params: { page, internal } })
  }

  async saveManifest(id, manifest) {
    return await this._post(`/save-manifest/${id}`, { manifest: manifest })
  }

  async get_all_tags() {
    return await this._get('/all-tags/')
  }

  async getArchiveLabelInfo() {
    return await this._get('/get-archive-information-labels/')
  }

  async unstageArchive(id) {
    return await this._get(`/archive/${id}/unstage/`)
  }

  async unstageArchives(archives) {
    return await this._post(`/unstage-archives/`, { archives: archives })
  }

  async deleteArchive(id) {
    return await this._get(`/archive/${id}/delete/`)
  }

  async getCheckRecordsArchived(recordList) {
    return await this._post(`/record-check/`, { recordList: recordList })
  }

  async get_collection(id) {
    return await this._get(`/collection/${id}`)
  }

  async add_archives_to_collection(id, archives) {
    return await this._post(`/collections/${id}/actions/add/`, {
      archives: archives,
    })
  }

  async remove_archives_from_collection(id, archives) {
    return await this._post(`/collections/${id}/actions/remove/`, {
      archives: archives,
    })
  }

  async delete_collection(id) {
    return await this._post(`/collections/${id}/actions/delete/`)
  }

  async create_collection(title, description, archives) {
    return await this._post(`/create-collection/`, {
      title: title,
      description: description,
      archives: archives,
    })
  }

  async get_steps_by_status(status, name) {
    return await this._post(`/get-steps-status/`, {
      status: status,
      name: name,
    })
  }
  async getArchiveCollections(id) {
    return await this._get(`/archive/${id}/get-collections/`)
  }

  // async getArchiveExists(id) {
  //   return await this._get(`/archive/${id}/search/`)
  // }
  // DUPLICATED

  // async getCheckRecordsArchived(recordList) {
  //   return await this._post(`/record-check/`, { recordList: recordList })
  // }

  // async get_collection(id) {
  //   return await this._get(`/collection/${id}`)
  // }

  // async add_archives_to_collection(id, archives) {
  //   return await this._post(`/collections/${id}/actions/add/`, {
  //     archives: archives,
  //   })
  // }

  // async remove_archives_from_collection(id, archives) {
  //   return await this._post(`/collections/${id}/actions/remove/`, {
  //     archives: archives,
  //   })
  // }

  // async delete_collection(id) {
  //   return await this._post(`/collections/${id}/actions/delete/`)
  // }

  // async create_collection(title, description, archives) {
  //   return await this._post(`/create-collection/`, {
  //     title: title,
  //     description: description,
  //     archives: archives,
  //   })
  // }

  async me() {
    return await this._get(`/me/`)
  }

  //API call to set api keys (works with the new api refactor)
  async setUserSettings(token_title, token) {
    return await this._post(`/user/me/settings/`, {
      [token_title]: token,
    })
  }

  async getUserSettings() {
    return await this._get('/user/me/settings/')
  }
}

export const api = new API({
  baseURL: API_URL,
})
