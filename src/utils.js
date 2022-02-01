import { AppContext } from '@/AppContext.js';
import moment from 'moment';

/**
 * General purpose utility functions, used across the application.
 *
 */
export const StepStatus = {
  NOT_RUN: 1,
  IN_PROGRESS: 2,
  FAILED: 3,
  COMPLETED: 4,
  WAITING_APPROVAL: 5,
  REJECTED: 6,
};

export const StepStatusLabel = {
  [StepStatus.NOT_RUN]: 'Not Run',
  [StepStatus.IN_PROGRESS]: 'In progress',
  [StepStatus.FAILED]: 'Failed',
  [StepStatus.COMPLETED]: 'Completed',
  [StepStatus.WAITING_APPROVAL]: 'Waiting for Approval',
  [StepStatus.REJECTED]: 'Rejected',
};

export const StepName = {
  SIP_UPLOAD: 1,
  HARVEST: 2,
  VALIDATION: 3,
  CHECKSUM: 4,
  ARCHIVE: 5,
  EDIT_MANIFEST: 6,
};

export const StepNameLabel = {
  [StepName.SIP_UPLOAD]: 'SIP Upload',
  [StepName.HARVEST]: 'Harvest',
  [StepName.VALIDATION]: 'Validate',
  [StepName.CHECKSUM]: 'Checksum',
  [StepName.ARCHIVE]: 'Upload to AM',
  [StepName.EDIT_MANIFEST]: 'Edit Manifest',
};

export const Permissions = {
  CAN_APPROVE_ARCHIVE: 'oais.can_approve_archive',
  CAN_REJECT_ARCHIVE: 'oais.can_reject_archive',
};

export function hasPermission(user, permission) {
  return user?.permissions.includes(permission) ?? false;
}

export function sendNotification(title, body, duration = 5000) {
  const notification = { title, body };
  AppContext.addNotification(notification);
  setTimeout(() => AppContext.removeNotification(notification), duration);
}

export function formatDateTime(date) {
  return moment(date).format('YYYY/MM/DD HH:mm:ss');
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
