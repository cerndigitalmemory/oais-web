import { api } from '@/api.js'
import { archiveType, recordType, recordTypeDetailed } from '@/types.js'
import { sendNotification, formatDateTime } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Table, Icon, Popup, Grid, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Storage } from '@/storage.js'

export class RecordsList extends React.Component {
  /* 
    Shows the results of the Harvest search including the available actions
  */

  static propTypes = {
    records: PropTypes.arrayOf(recordType).isRequired,
    recordsDetailed: PropTypes.arrayOf(recordTypeDetailed).isRequired,
    addRecord: PropTypes.func.isRequired,
    removeRecord: PropTypes.func.isRequired,
    checkedList: PropTypes.arrayOf(recordType).isRequired,
    archivedList: PropTypes.arrayOf(archiveType),
    isLoading: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { archivedList } = this.props

    return (
      <div>
        <Table>
          {this.props.records.length > 0 || !this.props.isLoading ? (
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="12">Title</Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="right">
                  Record ID
                </Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="center">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {this.props.records.map((record, i) => (
              <Record
                key={i}
                record={record}
                detailedRecord={this.props.recordsDetailed.filter(
                  (detailedRecord) => detailedRecord.recid == record.recid
                )}
                checkRecordAdd={this.props.addRecord}
                checkRecordRemove={this.props.removeRecord}
                checkedRecord={this.props.checkedList.filter(
                  (checkedRecord) => checkedRecord.recid == record.recid
                )}
                archivedList={archivedList}
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

class Record extends React.Component {
  static propTypes = {
    detailedRecord: PropTypes.arrayOf(recordTypeDetailed),
    record: recordType.isRequired,
    checkRecordAdd: PropTypes.func.isRequired,
    checkRecordRemove: PropTypes.func.isRequired,
    checkedRecord: PropTypes.arrayOf(recordType),
    archivedList: PropTypes.arrayOf(archiveType),
  }

  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      archived: false,
      archive: null,
      loading: true,
    }
  }

  componentDidUpdate(prevProps) {
    /*
      Each time the component updates if there is a change of state,
      and if the record id is in the archivedList then toogle checked status to true.
      If it is not in the list toogle status to false
    */

    if (prevProps.archivedList != this.props.archivedList) {
      this.setState({ loading: true })
      let archived = false
      this.props.archivedList.map((archivedItem) => {
        if (
          archivedItem.recid === this.props.record.recid &&
          archivedItem.source === this.props.record.source
        ) {
          console.log(this.props.record.recid, this.props.record.source)
          archived = true
        }
      })
      this.setState({ archived: archived, loading: false })
    }
  }

  componentDidMount() {
    /* 
      When the component is mounted, then each record is compared with the 
      staged archives list and if it is already a staged archive with the 
      same source and recid then the check button is disabled
    */
    if (this.props.archivedList) {
      let archived = false
      this.props.archivedList.map((archivedItem) => {
        if (
          archivedItem.recid === this.props.record.recid &&
          archivedItem.source === this.props.record.source
        ) {
          console.log(this.props.record.recid, this.props.record.source)
          archived = true
        }
      })
      this.setState({ archived: archived })
    }
    this.setState({ loading: false })
  }

  toggleChecked = () => {
    // Handles the check/uncheck of a record
    const { record, checkedRecord } = this.props
    const { checkRecordAdd } = this.props
    const { checkRecordRemove } = this.props
    if (checkedRecord[0]) {
      checkRecordRemove(record)
    } else {
      checkRecordAdd(record)
    }
  }

  toggleCollapse = () => {
    this.setState((state) => ({
      collapsed: !state.collapsed,
    }))
  }

  render() {
    const { record, detailedRecord, checkedRecord } = this.props
    const { collapsed, archive, archived, loading } = this.state

    let archivedRecord = null
    if (detailedRecord[0].archives.length > 0) {
      let timeWord = 'time'
      if (detailedRecord[0].archives.length > 1) {
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
                  This archive exists {detailedRecord[0].archives.length}{' '}
                  {timeWord}.
                </Header>
              </Grid.Row>
              {detailedRecord[0].archives.map((archive) => (
                <ShowArchive key={archive.id} archive={archive} />
              ))}
            </Grid.Column>
          </Grid>
        </Popup>
      )
    }

    return (
      <Table.Row>
        <Table.Cell textAlign="left">
          {record.title} {archivedRecord}
        </Table.Cell>
        <Table.Cell textAlign="right">{record.recid}</Table.Cell>
        <Table.Cell textAlign="right">
          {!loading && (
            <RecordActions
              {...{ record, archive, collapsed, checkedRecord, archived }}
              toggleCollapse={this.toggleCollapse}
              toggleChecked={this.toggleChecked}
            />
          )}
        </Table.Cell>
      </Table.Row>
    )
  }
}

class RecordActions extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
    archive: archiveType,
    archived: PropTypes.bool.isRequired,
    collapsed: PropTypes.bool.isRequired,
    checkedRecord: PropTypes.arrayOf(recordType),
    toggleCollapse: PropTypes.func.isRequired,
    toggleChecked: PropTypes.func.isRequired,
  }

  render() {
    const { record, archived, checkedRecord } = this.props
    const { toggleChecked } = this.props

    let checkButton
    if (archived == false) {
      if (checkedRecord[0]) {
        checkButton = (
          <Button circular basic icon="circle" onClick={toggleChecked} />
        )
      } else {
        checkButton = (
          <Button
            circular
            basic
            icon="circle outline"
            onClick={toggleChecked}
          />
        )
      }
    } else {
      // To trigger the popup while hovering on a disabled element, they need to be wrapped in <span> element. See https://github.com/Semantic-Org/Semantic-UI-React/issues/1413
      checkButton = (
        <Popup
          content="This record was already added to the Staging Area"
          trigger={
            <span>
              <Button circular basic icon="circle" disabled />{' '}
            </span>
          }
        />
      )
    }

    const sourceURLButton = (
      <Button
        href={record.source_url}
        title="Source URL"
        target="_blank"
        icon="globe"
      />
    )

    return (
      <div>
        <Button.Group basic size="small">
          {sourceURLButton}
          {checkButton}
        </Button.Group>
      </div>
    )
  }
}

class ShowArchive extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
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
