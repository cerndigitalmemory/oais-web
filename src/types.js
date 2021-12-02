import { arrayOf, exact, number, string } from "prop-types";

export const recordType = exact({
  id: number,
  url: string.isRequired,
  recid: string.isRequired,
  title: string,
  source: string.isRequired,
  authors: arrayOf(string),
});

export const notificationType = exact({
  title: string.isRequired,
  body: string.isRequired,
});

export const userType = exact({
  id: number.isRequired,
  username: string.isRequired,
  permissions: arrayOf(string).isRequired,
});

export const archiveType = exact({
  id: number.isRequired,
  source_url: string.isRequired,
  recid: string.isRequired,
  source: string.isRequired,
  timestamp: string,
  current_status: string,
  path_to_sip: string,
});

export const stepType = exact({
  id: number.isRequired,
  archive: number.isRequired,
  name:number.isRequired,
  start_date:string,
  finish_date:string,
  status:number,
  celery_task_id: string,
  input_data:string,
  input_step:string,
  output_data:string,
})
