import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { archiveType, collectionType } from '@/types.js'
import {
  StepStatus,
  StepStatusLabel,
  StepNameLabel,
  StepName,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from '@/utils.js'
import PropTypes from 'prop-types'
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
import { AddArchives } from '@/components/AddArchivesToCollection/AddArchives.jsx'
import _ from 'lodash'

export class CollectionArchives extends React.Component {
  static propTypes = {
    collection: collectionType.isRequired,
    onArchiveAdd: PropTypes.func.isRequired,
    onArchiveRemoval: PropTypes.func.isRequired,
  }

  render() {
    const { collection } = this.props
    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Tag Archives
        </Label>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={10}>
              <h1>Archives</h1>
            </Grid.Column>
            <Grid.Column floated="right" width={3} textAlign="right">
              <AddArchives
                onArchiveAdd={this.props.onArchiveAdd}
                archives={collection.archives}
                collection={collection}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <CollectionArchivesList
          archives={collection.archives}
          onArchiveRemoval={this.props.onArchiveRemoval}
        />
      </Segment>
    )
  }
}

export class CollectionArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType).isRequired,
    onArchiveRemoval: PropTypes.func.isRequired,
  }

  render() {
    const { archives } = this.props
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {archives.map((archive) => (
            <Archive
              key={archive.id}
              archive={archive}
              onArchiveRemoval={this.props.onArchiveRemoval}
            />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

class Archive extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
    onArchiveRemoval: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      open: false,
      steps: [],
    }
  }

  setOpen = (value) => {
    this.setState({ open: value })
  }

  handleArchiveRemoval = () => {
    this.props.onArchiveRemoval([this.props.archive.id])
    this.setOpen(false)
  }

  handleHarvest = async () => {
    const { archive } = this.props
    this.setState({ loading: true })
    try {
      await api.harvest(archive.id)
    } catch (e) {
      sendNotification('Error while archiving', e.message, 'error')
    }
    this.getArchiveStatus()
  }

  getArchiveStatus = async () => {
    const { archive } = this.props
    let steps = []
    try {
      steps = await api.getArchiveSteps(archive.id)
    } catch (e) {
      sendNotification('Error while getting archive', e.message, 'error')
    }
    this.setState({ loading: false, steps: steps })
  }

  componentDidMount() {
    this.getArchiveStatus()
  }

  static contextType = AppContext.Context

  render() {
    const { archive } = this.props
    const { steps, loading } = this.state
    const { user } = this.context

    let deleteModal = (
      <Modal
        closeIcon
        open={this.state.open}
        trigger={<Button icon="remove circle" color="red" />}
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
      >
        <Header icon="archive" content="Remove this archive?" />
        <Modal.Content>
          <p>
            Are you sure you want to remove this archive from this collection?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => this.setOpen(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" onClick={() => this.handleArchiveRemoval()}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    )

    let harvestButton
    if (loading) {
      harvestButton = <Button icon="archive" color="green" loading />
    } else {
      if (steps.length == 0) {
        harvestButton = (
          <Button
            icon="archive"
            color="green"
            name="Harvest archive"
            onClick={this.handleHarvest}
          />
        )
      } else {
        harvestButton = <Button icon="archive" color="grey" disabled />
      }
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
        <Table.Cell textAlign="right">
          <Link to={`/archive/${archive.id}`}>
            <Button>Details</Button>
          </Link>
          {deleteModal}
          {harvestButton}
        </Table.Cell>
      </Table.Row>
    )
  }
}
