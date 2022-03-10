import { api } from '@/api.js';
import { AppContext } from '@/AppContext.js';
import { archiveType, archiveTypeDetailed } from '@/types.js';
import { formatDateTime } from '@/utils.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { sendNotification } from '@/utils.js';

export class ArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType).isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
    checkArchiveAdd: PropTypes.func.isRequired,
    checkArchiveRemove: PropTypes.func.isRequired,
    detailedArchives: PropTypes.arrayOf(archiveTypeDetailed),
  };

  render() {
    const {
      archives,
      detailedArchives,
      onArchiveUpdate,
      checkArchiveAdd,
      checkArchiveRemove,
    } = this.props;
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Archive Status</Table.HeaderCell>
            <Table.HeaderCell>See Details</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {detailedArchives.map((archive) => (
            <Archive
              key={archive.id}
              archive={archive}
              onArchiveUpdate={onArchiveUpdate}
              checkArchiveAdd={checkArchiveAdd}
              checkArchiveRemove={checkArchiveRemove}
            />
          ))}
        </Table.Body>
      </Table>
    );
  }
}

class Archive extends React.Component {
  static propTypes = {
    archive: archiveTypeDetailed.isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
    checkArchiveAdd: PropTypes.func.isRequired,
    checkArchiveRemove: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  static contextType = AppContext.Context;

  toggleChecked = () => {
    // Handles the check/uncheck of a record
    const { checkArchiveAdd, checkArchiveRemove, archive } = this.props;
    this.setState((state) => ({
      checked: !state.checked,
    }));
    if (!this.state.checked) {
      checkArchiveAdd(archive);
    } else {
      checkArchiveRemove(archive);
    }
  };

  render() {
    const { archive } = this.props;
    const { user } = this.context;
    const { checked } = this.state;

    let StatusLabel;

    if (archive.duplicates.length == 0) {
      StatusLabel = <p>New</p>;
    } else {
      StatusLabel = <p> Exists ({archive.duplicates.length}) </p>;
    }

    return (
      <Table.Row>
        <Table.Cell>{archive.id}</Table.Cell>
        <Table.Cell>
          {archive.recid} ({archive.source})
        </Table.Cell>
        <Table.Cell>
          <Link to={`/users/${archive.creator.id}`}>
            {archive.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell>{formatDateTime(archive.timestamp)}</Table.Cell>
        <Table.Cell>{StatusLabel}</Table.Cell>
        <Table.Cell>
          <Link to={`/archive/${archive.id}`}>See Steps</Link>
        </Table.Cell>
        <Table.Cell>
          <ArchiveActions
            {...{ archive, checked }}
            toggleChecked={this.toggleChecked}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

class ArchiveActions extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
    checked: PropTypes.bool,
    toggleChecked: PropTypes.func.isRequired,
  };

  render() {
    const { checked } = this.props;
    const { toggleChecked } = this.props;

    let checkButton;
    if (checked) {
      checkButton = (
        <Button
          circular
          color="olive"
          icon="check"
          onClick={toggleChecked}
          title="Check"
        />
      );
    } else {
      checkButton = (
        <Button
          circular
          basic
          color="olive"
          icon="check"
          onClick={toggleChecked}
          title="Check"
        />
      );
    }

    return <div>{checkButton}</div>;
  }
}
