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
  record: recordType.isRequired,
  creator: userType.isRequired,
  creation_date: string.isRequired,
  celery_task_id: string,
  status: number.isRequired,
  stage: number.isRequired,
});
