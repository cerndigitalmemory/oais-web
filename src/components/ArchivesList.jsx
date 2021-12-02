import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { archiveType } from "@/types.js";
import {
  StepStatus,
  StepStatusLabel,
  StepNameLabel,
  StepName,
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
            <Table.HeaderCell>See Steps</Table.HeaderCell>
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


  render() {
    const { archive } = this.props;
    const { user } = this.context;


    return (
      <Table.Row>
        <Table.Cell>{archive.id}</Table.Cell>
        <Table.Cell>
            {archive.recid} ({archive.source})
        </Table.Cell>
        <Table.Cell>
          kchelakis
        </Table.Cell>
        <Table.Cell>{formatDateTime(archive.timestamp)}</Table.Cell>
        <Table.Cell>{archive.current_status}</Table.Cell>
        <Table.Cell><Link to={`/archive/${archive.id}`}>See Steps</Link></Table.Cell>
      </Table.Row>
    );
  }
}
