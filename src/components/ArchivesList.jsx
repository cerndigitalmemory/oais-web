import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { archiveType } from "@/types.js";
import {
  ArchiveStatus,
  ArchiveStatusLabel,
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
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Stage</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {archives.map((archive) => (
            <Archive
              key={archive.id}
              archive={archive}
              onArchiveUpdate={onArchiveUpdate}
            />
          ))}
        </Table.Body>
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
      <Table.Row>
        <Table.Cell>{archive.id}</Table.Cell>
        <Table.Cell>
          <Link to={`/records/${archive.record.id}`}>
            {archive.record.recid} ({archive.record.source})
          </Link>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/users/${archive.creator.id}`}>
            {archive.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell>{formatDateTime(archive.creation_date)}</Table.Cell>
        <Table.Cell>{ArchiveStatusLabel[archive.status]}</Table.Cell>
        <Table.Cell>{ArchiveStageLabel[archive.stage]}</Table.Cell>
        <Table.Cell>{actions}</Table.Cell>
      </Table.Row>
    );
  }
}
