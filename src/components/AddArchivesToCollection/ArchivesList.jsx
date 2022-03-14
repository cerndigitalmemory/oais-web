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

/**
 * This component loads the list of the archives with a check button with which the user can
 * add the archive to the collection and a details button with which the user can see more details about the archive.
 */

export class ArchivesList extends React.Component {
  static propTypes = {
    prevArchives: PropTypes.arrayOf(archiveType),
    newArchives: PropTypes.arrayOf(archiveType).isRequired,
    addArchive: PropTypes.func.isRequired,
    removeArchive: PropTypes.func.isRequired,
  }

  render() {
    const { newArchives, prevArchives } = this.props
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Record</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>See Steps</Table.HeaderCell>
            <Table.HeaderCell>Add to Collection</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {newArchives.map((archive) => (
            <Archive
              key={archive.id}
              newArchive={archive}
              prevArchives={prevArchives}
              addArchive={this.props.addArchive}
              removeArchive={this.props.removeArchive}
            />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

class Archive extends React.Component {
  static propTypes = {
    newArchive: archiveType.isRequired,
    prevArchives: PropTypes.arrayOf(archiveType),
    addArchive: PropTypes.func.isRequired,
    removeArchive: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      loading: false,
    }
  }

  static contextType = AppContext.Context

  handleArchiveCheck = () => {
    const { newArchive, prevArchives, addArchive, removeArchive } = this.props
    this.setState((state) => ({
      checked: !state.checked,
    }))
    if (!this.state.checked) {
      addArchive(newArchive)
    } else {
      removeArchive(newArchive)
    }
  }

  handleDisabled(newArchive) {
    return this.props.prevArchives.some((item) => newArchive.id === item.id)
  }

  render() {
    const { newArchive } = this.props
    const { checked } = this.state
    const { user } = this.context

    let checkButton
    if (this.handleDisabled(newArchive)) {
      checkButton = <Button circular basic icon="check" disabled />
    } else {
      if (checked) {
        checkButton = (
          <Button
            circular
            color="olive"
            icon="check"
            onClick={this.handleArchiveCheck}
            title="Check"
          />
        )
      } else {
        checkButton = (
          <Button
            circular
            basic
            color="olive"
            icon="check"
            onClick={this.handleArchiveCheck}
            title="Check"
          />
        )
      }
    }

    return (
      <Table.Row>
        <Table.Cell>{newArchive.id}</Table.Cell>
        <Table.Cell>
          {newArchive.recid} ({newArchive.source})
        </Table.Cell>
        <Table.Cell>
          <Link to={`/users/${newArchive.creator.id}`}>
            {newArchive.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell>{formatDateTime(newArchive.timestamp)}</Table.Cell>

        <Table.Cell>
          <Link to={`/archive/${newArchive.id}`} target="_blank">
            See Steps
          </Link>
        </Table.Cell>
        <Table.Cell>{checkButton}</Table.Cell>
      </Table.Row>
    )
  }
}
