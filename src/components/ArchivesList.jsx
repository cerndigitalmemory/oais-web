import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { archiveType } from "@/types.js";
import {
  ArchiveStatus,
  ArchiveStatusLabel,
  ArchiveStage,
  ArchiveStageLabel,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Table, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export class ArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType).isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  };

  render() {
    const { archives, onArchiveUpdate } = this.props;
    return (
      <Table textAlign="center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Record</th>
            <th>Creator</th>
            <th>Creation Date</th>
            <th>Status</th>
            <th>Stage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((archive) => (
            <Archive
              key={archive.id}
              archive={archive}
              onArchiveUpdate={onArchiveUpdate}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}

class Archive extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  };

  static contextType = AppContext.Context;

  approve = async () => {
    const { archive, onArchiveUpdate } = this.props;
    try {
      const updatedArchive = await api.approveArchive(archive.id);
      onArchiveUpdate(updatedArchive);
    } catch (e) {
      sendNotification("Error while approving archive", e.message);
    }
  };

  reject = async () => {
    const { archive, onArchiveUpdate } = this.props;
    try {
      const updatedArchive = await api.rejectArchive(archive.id);
      onArchiveUpdate(updatedArchive);
    } catch (e) {
      sendNotification("Error while rejecting archive", e.message);
    }
  };

  render() {
    const { archive } = this.props;
    const { user } = this.context;

    const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);

    let actions = null;
    if (archive.status === ArchiveStatus.WAITING_APPROVAL) {
      actions = (
        <Button.Group>
          {canApprove && (
            <Button onClick={this.approve} color="green" title="Approve">
              <Icon name='check' />
            </Button>
          )}
          {canReject && (
            <Button onClick={this.reject} color="red" title="Reject">
              <Icon name='cancel' />
            </Button>
          )}
        </Button.Group>
      );
    }

    return (
      <tr>
        <td>{archive.id}</td>
        <td>
          <Link to={`/records/${archive.record.id}`}>
            {archive.record.recid} ({archive.record.source})
          </Link>
        </td>
        <td>
          <Link to={`/users/${archive.creator.id}`}>
            {archive.creator.username}
          </Link>
        </td>
        <td>{formatDateTime(archive.creation_date)}</td>
        <td>{ArchiveStatusLabel[archive.status]}</td>
        <td>{ArchiveStageLabel[archive.stage]}</td>
        <td>{actions}</td>
      </tr>
    );
  }
}
