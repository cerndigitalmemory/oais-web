import { arrayOf, exact, number, string, bool, array, object } from 'prop-types'
import { List } from 'semantic-ui-react'

export const notificationType = exact({
  title: string.isRequired,
  body: string.isRequired,
  type: string,
})

export const userType = exact({
  id: number.isRequired,
  username: string.isRequired,
  permissions: arrayOf(string).isRequired,
  first_name: string,
  last_name: string,
  profile: object,
})

export const archiveType = exact({
  id: number.isRequired,
  source_url: string.isRequired,
  recid: string.isRequired,
  source: string.isRequired,
  creator: userType,
  timestamp: string,
  last_step: number,
  path_to_sip: string,
  next_steps: List,
  manifest: JSON,
  staged: bool,
  title: string,
  restricted: bool,
})

export const archiveTypeDetailed = exact({
  // This is an archive type with a list of similar archives (same recid + source)
  // and a list of the collections this archive is in
  id: number.isRequired,
  source_url: string.isRequired,
  recid: string.isRequired,
  source: string.isRequired,
  creator: userType,
  timestamp: string,
  last_step: number,
  path_to_sip: string,
  next_steps: List,
  manifest: JSON,
  collections: List,
  steps: List,
  duplicates: List,
  staged: bool,
  title: string,
  restricted: bool,
})

export const collectionType = exact({
  id: number.isRequired,
  title: string,
  description: string,
  creator: userType,
  timestamp: string,
  last_modification_date: string,
  archives: arrayOf(archiveType),
})

export const recordType = exact({
  id: number,
  source_url: string.isRequired,
  recid: string.isRequired,
  title: string,
  record_creator: userType,
  timestamp: string,
  source: string.isRequired,
  authors: arrayOf(string),
  tags: List,
})

export const recordTypeDetailed = exact({
  /*
   * This is a record type with a list of "similar" archives (same recid + source)
   */
  id: number,
  source_url: string.isRequired,
  recid: string.isRequired,
  title: string,
  record_creator: userType,
  timestamp: string,
  source: string.isRequired,
  authors: arrayOf(string),
  tags: arrayOf(collectionType),
  archives: List,
})

export const stepType = exact({
  id: number.isRequired,
  archive: number.isRequired,
  name: number.isRequired,
  start_date: string,
  finish_date: string,
  status: number,
  celery_task_id: string,
  input_data: string,
  input_step: number,
  output_data: string,
})
