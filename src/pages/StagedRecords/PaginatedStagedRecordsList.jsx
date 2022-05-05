import { api } from '@/api.js'
import { sendNotification, formatDateTime } from '@/utils.js'
import PropTypes from 'prop-types'
import { archiveType, archiveTypeDetailed } from '@/types.js'
import React from 'react'
import { Header, Table, Button, Icon, Grid, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { AddTagsToArchives } from '@/components/AddTagsToArchivesDropdown/AddTagsToArchives.jsx'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedRecordsList extends React.Component {
  static propTypes = {
    stagedArchives: PropTypes.arrayOf(archiveTypeDetailed),
    onArchiveUpdate: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    totalStagedArchives: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
  }

  stageArchive = async (archives) => {
    await api.unstageArchives(archives)
  }

  handleArchiving = async () => {
    const archives = this.props.stagedArchives
    this.props.setLoading()
    try {
      this.stageArchive(archives)
      sendNotification(
        'Archives archived successfully',
        archives.length + ' archived',
        'success'
      )
    } catch (e) {
      sendNotification('Error while archiving', e.message, 'error')
    } finally {
      this.props.setLoading()
    }
  }

  render() {
    const { stagedArchives, onArchiveUpdate, totalRecords, page } = this.props

    return (
      <div>
        <RecordsList
          archives={stagedArchives}
          onArchiveUpdate={onArchiveUpdate}
        />
        <br />
        <Grid columns={1} stackable>
          <Grid.Column floated="right" textAlign="right">
            <Button primary onClick={this.handleArchiving}>
              Archive All
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

class RecordsList extends React.Component {
  /* 
    Shows the results of the Harvest search including the available actions
  */

  static propTypes = {
    archives: PropTypes.arrayOf(archiveTypeDetailed).isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  render() {
    return (
      <React.Fragment>
        <Table>
          {this.props.archives.length > 0 ? (
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="9">Title</Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="right">
                  Record ID
                </Table.HeaderCell>
                <Table.HeaderCell width="4" textAlign="right">
                  Tag
                </Table.HeaderCell>
                <Table.HeaderCell width="1" textAlign="center">
                  {' '}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {this.props.archives.map((archive, i) => (
              <Record
                key={i}
                archive={archive}
                onArchiveUpdate={this.props.onArchiveUpdate}
              />
            ))}
          </Table.Body>
        </Table>
      </React.Fragment>
    )
  }
}

class Record extends React.Component {
  static propTypes = {
    archive: archiveTypeDetailed.isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  handleDelete = async () => {
    await api.deleteArchive(this.props.archive.id)
    this.props.onArchiveUpdate()
  }

  render() {
    const { archive } = this.props

    let archivedRecord = null
    if (archive.duplicates.length > 0) {
      let timeWord = 'time'
      if (archive.duplicates.length > 1) {
        timeWord = 'times'
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
                  This archive exists {archive.duplicates.length} {timeWord}.
                </Header>
              </Grid.Row>
              {archive.duplicates.map((duplicate) => (
                <ShowArchive key={duplicate.id} archive={duplicate} />
              ))}
            </Grid.Column>
          </Grid>
        </Popup>
      )
    }

    let deleteButton = (
      <Button icon="remove" color="red" onClick={this.handleDelete} />
    )

    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell textAlign="left">
            <b>{archive.title}</b> ({archive.source})
          </Table.Cell>
          <Table.Cell textAlign="right">{archive.recid}</Table.Cell>
          <Table.Cell textAlign="right">
            <AddTagsToArchives archive={this.props.archive} />
          </Table.Cell>
          <Table.Cell textAlign="right">{deleteButton}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }
}

class ShowArchive extends React.Component {
  static propTypes = {
    archive: archiveType,
  }

  render() {
    const { archive } = this.props

    return (
      <Grid.Row>
        <Link to={`/archive/${archive.id}`}>
          {'Archive '}
          {archive.id}
        </Link>
        {' harvested on '}
        {formatDateTime(archive.timestamp)}
      </Grid.Row>
    )
  }
}
