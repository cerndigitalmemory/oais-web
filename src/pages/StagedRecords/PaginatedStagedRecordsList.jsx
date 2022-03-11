import { api } from '@/api.js';
import { sendNotification, formatDateTime } from '@/utils.js';
import PropTypes from 'prop-types';
import { archiveType, recordTypeDetailed } from '@/types.js';
import React from 'react';
import {
  Header,
  Table,
  Button,
  Icon,
  Grid,
  Popup,
  Pagination,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Storage } from '@/storage.js';
/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedRecordsList extends React.Component {
  static propTypes = {
    records: PropTypes.arrayOf(recordTypeDetailed),
    onRecordUpdate: PropTypes.func.isRequired,
    totalRecords: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { records, onRecordUpdate, totalRecords, page } = this.props;
    let pageCount = Math.ceil(totalRecords / 8);

    return (
      <div>
        <RecordsList records={records} onRecordUpdate={onRecordUpdate} />

        <div>
          <Pagination
            activePage={page}
            onPageChange={onRecordUpdate}
            totalPages={pageCount}
          />
        </div>
      </div>
    );
  }
}

class RecordsList extends React.Component {
  /* 
    Shows the results of the Harvest search including the available actions
  */

  static propTypes = {
    records: PropTypes.arrayOf(recordTypeDetailed).isRequired,
    onRecordUpdate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Table>
          {this.props.records.length > 0 ? (
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="12">Title</Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="right">
                  Record ID
                </Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="center">
                  Archive
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {this.props.records.map((record, i) => (
              <Record
                key={i}
                record={record}
                onRecordUpdate={this.props.onRecordUpdate}
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

class Record extends React.Component {
  static propTypes = {
    record: recordTypeDetailed.isRequired,
    onRecordUpdate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      archived: false,
    };
  }

  handleDelete = async () => {
    Storage.removeRecord(this.props.record);
    this.props.onRecordUpdate();
  };

  handleArchiving = async () => {
    const record = this.props.record;
    this.setState({ archived: true });
    try {
      await api.createArchive(record.source, record.recid);
      Storage.removeRecord(record);
      sendNotification('Record archived successfully', record.recid);
    } catch (e) {
      sendNotification('Error while archiving', e.message);
    } finally {
      this.props.onRecordUpdate();
    }
  };

  render() {
    const { record } = this.props;
    const { archived } = this.state;

    let archiveButton = null;
    if (archived) {
      archiveButton = <Button icon="archive" disabled />;
    } else {
      archiveButton = <Button icon="archive" onClick={this.handleArchiving} />;
    }

    let archivedRecord = null;
    if (record.archives.length > 0) {
      let timeWord = 'time';
      if (record.archives.length > 1) {
        timeWord = 'times';
      }
      archivedRecord = (
        <Popup
          flowing
          hoverable
          trigger={<Icon color="grey" name="question circle outline" />}
        >
          <Grid centered divided>
            <Grid.Column>
              <Grid.Row>
                <Header>
                  {' '}
                  This archive exists {record.archives.length} {timeWord}.
                </Header>
              </Grid.Row>
              {record.archives.map((archive) => (
                <ShowArchive key={archive.id} archive={archive} />
              ))}
            </Grid.Column>
          </Grid>
        </Popup>
      );
    }

    let deleteButton = (
      <Button icon="remove" color="red" onClick={this.handleDelete} />
    );

    return (
      <Table.Row>
        <Table.Cell textAlign="left">
          {record.title} {archivedRecord}
        </Table.Cell>
        <Table.Cell textAlign="right">{record.recid}</Table.Cell>
        <Table.Cell textAlign="right">
          {archiveButton}
          {deleteButton}
        </Table.Cell>
      </Table.Row>
    );
  }
}

class ShowArchive extends React.Component {
  static propTypes = {
    archive: archiveType,
  };

  render() {
    const { archive } = this.props;

    return (
      <Grid.Row>
        <Link to={`/archive/${archive.id}`}>
          {'Archive '}
          {archive.id}
        </Link>
        {' harvested on '}
        {formatDateTime(archive.timestamp)}
      </Grid.Row>
    );
  }
}
