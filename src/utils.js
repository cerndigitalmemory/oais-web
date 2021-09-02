import { AppContext } from "@/AppContext.js";
import moment from "moment";

export const ArchiveStatus = {
  PENDING: 1,
  IN_PROGRESS: 2,
  FAILED: 3,
  COMPLETED: 4,
  WAITING_APPROVAL: 5,
  REJECTED: 6,
};

export const ArchiveStatusLabel = {
  [ArchiveStatus.PENDING]: "Pending",
  [ArchiveStatus.IN_PROGRESS]: "In progress",
  [ArchiveStatus.FAILED]: "Failed",
  [ArchiveStatus.COMPLETED]: "Completed",
  [ArchiveStatus.WAITING_APPROVAL]: "Waiting for Approval",
  [ArchiveStatus.REJECTED]: "Rejected",
};

export const ArchiveStage = {
  WAITING_HARVEST: 1,
  SIP_EXISTS: 2,
  VALID_SIP: 3
};

export const ArchiveStageLabel = {
  [ArchiveStage.WAITING_HARVEST]: "Waiting for harvest",
  [ArchiveStage.SIP_EXISTS]: "SIP exists",
  [ArchiveStage.VALID_SIP]: "Valid SIP",
};

export const Permissions = {
  CAN_APPROVE_ARCHIVE: "oais.can_approve_archive",
  CAN_REJECT_ARCHIVE: "oais.can_reject_archive",
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
  return moment(date).format("YYYY/MM/DD HH:mm:ss");
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
