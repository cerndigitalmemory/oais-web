import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { archiveType } from '@/types.js'
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
import { Button, Table, Loader, Dropdown, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

export class ArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType).isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  render() {
    const { archives, onArchiveUpdate } = this.props
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Next Step</Table.HeaderCell>
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
    )
  }
}

class Archive extends React.Component {
  static propTypes = {
    archive: archiveType.isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      nextStep: null,
      loading: false,
    }
  }

  static contextType = AppContext.Context

  handleStepChange = async (event, { value }) => {
    this.setState({ nextStep: event.target.value })
    this.setState({ loading: true })
    await api.archiveNextStep(value, this.props.archive)
  }

  render() {
    const { archive } = this.props
    const { user } = this.context

    const nextSteps = _.map(archive.next_steps, (nextStep) => ({
      key: nextStep,
      text: StepNameLabel[nextStep],
      value: nextStep,
    }))

    let dropdown
    if (!this.state.loading) {
      if (archive.next_steps.length > 0) {
        dropdown = (
          <Menu compact>
            <Dropdown
              placeholder="Select Next Step"
              options={nextSteps}
              simple
              item
              onChange={this.handleStepChange}
            />
          </Menu>
        )
      } else {
        if (archive.last_step) {
          dropdown = <p>Completed</p>
        }
      }
    } else {
      dropdown = <Loader active inline />
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
        <Table.Cell>{dropdown}</Table.Cell>
        <Table.Cell>
          <Link to={`/archive/${archive.id}`}>See Steps</Link>
        </Table.Cell>
      </Table.Row>
    )
  }
}
