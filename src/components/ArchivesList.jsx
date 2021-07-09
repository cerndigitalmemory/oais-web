import { api } from "@/api.js";
import { ArchiveStatus, ArchiveStatusLabel } from "@/utils.js";
import React from "react";
import { Link } from "react-router-dom";

export class ArchivesList extends React.Component {
  render() {
    const { archives, onArchiveUpdate } = this.props;
    return (
      <table className="archive-table">
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
      </table>
    );
  }
}

class Archive extends React.Component {
  approve = () => {
    const { archive, onArchiveUpdate } = this.props;
    api.approveArchive(archive.id).then((archive) => onArchiveUpdate(archive));
  };

  reject = () => {
    const { archive, onArchiveUpdate } = this.props;
    api.rejectArchive(archive.id).then((archive) => onArchiveUpdate(archive));
  };

  render() {
    const { archive } = this.props;

    let actions = null;
    if (archive.status === ArchiveStatus.WAITING_APPROVAL) {
      actions = (
        <div>
          <button onClick={() => this.approve()}>Approve</button>
          <button onClick={() => this.reject()}>Reject</button>
        </div>
      );
    }

    return (
      <tr className="archive-table-row">
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
        <td className="center-col">{ArchiveStatusLabel[archive.status]}</td>
        <td>{actions}</td>
      </tr>
    );
  }
}
