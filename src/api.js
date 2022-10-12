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

  async searchById(source, id) {
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
  //   return await this._post(`/archives/create/${recid}/${source}/`)
  // }

  async createStagedArchive(records) {
    return await this._post(`/users/me/staging-area/`, { records: records })
  }

  async parseURL(url) {
    return await this._post('/search/parse-url/', { url: url })
  }

  async archiveDetails(id) {
    return await this._get(`/archives/${id}/`)
  }

  async archiveNextStep(step_no, archive) {
    return await this._post(`archives/${archive.id}/next-step/`, {
      next_step: step_no,
      archive: archive,
    })
  }

  async createUploadJob() {
    return this._post(`upload/jobs/create/`)
  }

  async addFileToUploadJob(uploadJobId, file) {
    let formData = new FormData()
    formData.append(file.webkitRelativePath, file)
    return await this._post(`upload/jobs/${uploadJobId}/add/file/`, formData)
  }

  async uploadFolder(files) {
    const { uploadJobId } = await this.createUploadJob()

    for (const file of files) {
      let formData = new FormData()
      formData.append('file', file)
      await this.addFileToUploadJob(uploadJobId, file)
    }

    await this._post(`upload/jobs/${uploadJobId}/sip/`)

    return await this._post(`upload/jobs/${uploadJobId}/archive/`)
  }

  async upload(file) {
    var formData = new FormData()
    formData.append('file', file)
    return await this._post(`/upload/sip`, formData)
  }

  // TODO: unify all uploading logic
  // async upload(files, compressed_sip = False) {
  //   const { uploadJobId } = await this.createUploadJob()
  //   for (const file of files) await this.addFileToUploadJob(uploadJobId, file)
  //
  //   if (compressed_sip) {
  //
  //   } {
  //     await this._post(`upload/jobs/`)
  //   }
  //
  // }

  async archives(page = 1, filter = 'public') {
    return await this._get('/archives/', { params: { page, filter } })
  }

  async stagedArchives() {
    return await this._get('/users/me/staging-area/?paginated=false')
  }

  async stagedArchivesPaginated(page) {
    return await this._get('/users/me/staging-area', { params: { page } })
  }

  async archivesByUser(id, page = 1) {
    return await this._get(`/users/${id}/archives/`, { params: { page } })
  }

  async archivesByUserStaged(id, page = 1) {
    return await this._get(`/users/${id}/archives-staged/`, {
      params: { page },
    })
  }

  async getArchivesDetailed(archives) {
    return await this._post(`/archives/details/`, { archives: archives })
  }

  async getArchiveSteps(id) {
    return await this._get(`/archives/${id}/steps/`)
  }

  async user(id) {
    return await this._get(`/users/${id}/`)
  }

  async settings() {
    return await this._get('/settings/')
  }

  async approveArchive(id) {
    return await this._post(`/steps/${id}/approve/`)
  }

  async rejectArchive(id) {
    return await this._post(`/steps/${id}/reject/`)
  }

  async collections(page = 1, internal) {
    return await this._get('/tags/', { params: { page, internal } })
  }

  async saveManifest(id, manifest) {
    return await this._post(`/archives/${id}/save-manifest/`, {
      manifest: manifest,
    })
  }

  async getAllTags() {
    return await this._get('/users/me/tags')
  }

  async getSourceStatus() {
    return await this._get('/users/me/sources')
  }

  async getArchiveLabelInfo() {
    return await this._get('/get-archive-information-labels/')
  }

  async unstageArchive(id) {
    return await this._get(`/archives/${id}/unstage`)
  }

  async unstageArchives(archives) {
    return await this._post(`/archives/unstage/`, { archives: archives })
  }

  async deleteArchive(id) {
    return await this._post(`/archives/${id}/delete/`)
  }

  async getCheckRecordsArchived(recordList) {
    return await this._post(`/records/check`, { recordList: recordList })
  }

  async collection(id, internal) {
    return await this._get(`/tags/${id}`, { params: { internal } })
  }

  async addArchivesToCollection(id, archives) {
    return await this._post(`/tags/${id}/add/`, {
      archives: archives,
    })
  }

  async removeArchivesFromCollection(id, archives) {
    return await this._post(`/tags/${id}/remove/`, {
      archives: archives,
    })
  }

  async collectionDelete(id) {
    return await this._post(`/tags/${id}/delete/`)
  }

  async collectionCreate(title, description, archives) {
    return await this._post(`/tags/create/`, {
      title: title,
      description: description,
      archives: archives,
    })
  }

  async getStepsStatus(status, name) {
    return await this._get(`/users/me/stats`, {
      status: status,
      name: name,
    })
  }

  async getArchiveCollections(id) {
    return await this._get(`/archives/${id}/tags/`)
  }

  // async getArchiveExists(id) {
  //   return await this._get(`/archives/${id}/search/`)
  // }

  //API call to set api kcdeys (works with the new api refactor)
  async setUserSettings(token_title, token) {
    return await this._post(`/users/me/`, {
      [token_title]: token,
    })
  }

  async getUserSettings() {
    return await this._get('/users/me/')
  }
}

export const api = new API({
  baseURL: API_URL,
})
