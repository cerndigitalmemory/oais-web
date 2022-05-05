import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { archiveType, collectionType } from '@/types.js'
import {
  StepStatusLabel,
  formatDateTime,
  sendNotification,
  hasPermission,
  Permissions,
} from '@/utils.js'
import PropTypes, { nominalTypeHack } from 'prop-types'
import React from 'react'
import {
  Button,
  Table,
  Segment,
  Grid,
  Label,
  Modal,
  Header,
  Icon,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

export class JobArchives extends React.Component {
  static propTypes = {
    job: collectionType.isRequired,
  }

  render() {
    const { job } = this.props
    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Job Archives
        </Label>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left">
              <h1>Archives</h1>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <CollectionArchivesList archives={job.archives} />
      </Segment>
    )
  }
}

export class CollectionArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType).isRequired,
  }

  render() {
    const { archives } = this.props
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Last Step Status</Table.HeaderCell>
            <Table.HeaderCell colSpan="2">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {archives.map((archive) => (
            <Archive key={archive.id} archive={archive} />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

class Archive extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      open: false,
      steps: [],
      lastStep: null,
    }
  }

  getArchiveStatus = async () => {
    const { archive } = this.props
    let steps = []
    try {
      steps = await api.get_archive_steps(archive.id)
      this.setState({ steps: steps, lastStep: steps[steps.length - 1] })
    } catch (e) {
      sendNotification('Error while getting archive', e.message, 'error')
    }
  }

  componentDidMount() {
    this.getArchiveStatus()
    this.setState({ loading: false })
  }

  approve = async () => {
    const { lastStep } = this.state
    try {
      this.setState({ loading: true })
      const updatedStep = await api.approveArchive(lastStep.id)
      this.getArchiveStatus()
      this.setState({ loading: false })
    } catch (e) {
      sendNotification('Error while approving archive', e.message, 'error')
    }
  }

  reject = async () => {
    const { lastStep } = this.state
    try {
      this.setState({ loading: true })
      const updatedStep = await api.rejectArchive(lastStep.id)
      this.getArchiveStatus()
      this.setState({ loading: false })
    } catch (e) {
      sendNotification('Error while rejecting archive', e.message, 'error')
    }
  }

  static contextType = AppContext.Context

  render() {
    const { archive } = this.props
    const { steps, loading, lastStep } = this.state
    const { user } = this.context

    const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE)
    const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE)

    let actions = null
    if (canApprove && canReject) {
      if (!loading && lastStep) {
        if (lastStep.status === 5) {
          actions = (
            <Button.Group>
              <Button onClick={this.approve} color="green" title="Approve" icon>
                <Icon name="check" />
              </Button>
              <Button onClick={this.reject} color="red" title="Reject" icon>
                <Icon name="cancel" />
              </Button>
            </Button.Group>
          )
        }
      }
    }

    return (
      <Table.Row>
        <Table.Cell>{archive.id}</Table.Cell>
        <Table.Cell>
          {archive.recid} ({archive.source})
        </Table.Cell>
        <Table.Cell>{archive.title}</Table.Cell>
        <Table.Cell>
          <Link to={`/users/${archive.creator.id}`}>
            {archive.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell>{formatDateTime(archive.timestamp)}</Table.Cell>
        <Table.Cell>
          {loading || !lastStep ? (
            <p>Loading...</p>
          ) : (
            <p>{StepStatusLabel[lastStep.status]}</p>
          )}
        </Table.Cell>
        <Table.Cell>{actions}</Table.Cell>
        <Table.Cell>
          <Link to={`/archive/${archive.id}`}>
            <Button>Details</Button>
          </Link>
        </Table.Cell>
      </Table.Row>
    )
  }
}
