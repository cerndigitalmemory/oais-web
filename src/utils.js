import { AppContext } from "@/AppContext.js";

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
