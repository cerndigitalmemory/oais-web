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
  HARVEST_REQUESTED: 1,
  HARVESTING: 2,
  VALIDATION_REQUESTED: 3,
  CHECKING_REGISTRY: 4,
  VALIDATION: 5,
  UPLOADING: 6,
};

export const ArchiveStageLabel = {
  [ArchiveStage.HARVEST_REQUESTED]: "Waiting for harvest",
  [ArchiveStage.HARVESTING]: "Harvesting",
  [ArchiveStage.VALIDATION_REQUESTED]: "Waiting for Validation",
  [ArchiveStage.CHECKING_REGISTRY]: "SIP Exists",
  [ArchiveStage.VALIDATION]: "Validated",
  [ArchiveStage.UPLOADING]: "Uploading",
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
