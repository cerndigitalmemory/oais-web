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
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell width={6}>Title</Table.HeaderCell>
            <Table.HeaderCell>Original Record</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
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

    let showTitle = ''
    if (archive.title) {
      showTitle = archive.title
    }

    return (
      <Table.Row>
        <Table.Cell>{archive.id}</Table.Cell>
        <Table.Cell>
          <Link to={`/archive/${archive.id}`}>{showTitle}</Link>{' '}
        </Table.Cell>
        <Table.Cell>
          <code>{archive.recid}</code> ({archive.source})
        </Table.Cell>
        <Table.Cell>{formatDateTime(archive.timestamp)}</Table.Cell>
      </Table.Row>
    )
  }
}
