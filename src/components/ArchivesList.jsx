import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import {
  ArchiveStatus,
  ArchiveStatusLabel,
  hasPermission,
  Permissions,
} from "@/utils.js";
import React from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export class ArchivesList extends React.Component {
  render() {
    const { archives, onArchiveUpdate } = this.props;
    return (
      <Table size="sm" hover className="text-center align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Record</th>
            <th>Creator</th>
            <th>Creation Date</th>
            <th>Status</th>
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
  static contextType = AppContext.Context;

  approve = async () => {
    const { archive, onArchiveUpdate } = this.props;
    const updatedArchive = await api.approveArchive(archive.id);
    onArchiveUpdate(updatedArchive);
  };

  reject = async () => {
    const { archive, onArchiveUpdate } = this.props;
    const updatedArchive = await api.rejectArchive(archive.id);
    onArchiveUpdate(updatedArchive);
  };

  render() {
    const { archive } = this.props;
    const { user } = this.context;

    const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);

    let actions = null;
    if (archive.status === ArchiveStatus.WAITING_APPROVAL) {
      actions = (
        <ButtonGroup size="sm">
          {canApprove && (
            <Button onClick={this.approve} variant="success" title="Approve">
              <i className="bi-check-lg" />
            </Button>
          )}
          {canReject && (
            <Button onClick={this.reject} variant="danger" title="Reject">
              <i className="bi-x-lg" />
            </Button>
          )}
        </ButtonGroup>
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
        <td>{archive.creation_date}</td>
        <td>{ArchiveStatusLabel[archive.status]}</td>
        <td>{actions}</td>
      </tr>
    );
  }
}
