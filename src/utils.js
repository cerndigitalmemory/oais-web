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
