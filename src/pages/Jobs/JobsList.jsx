import { AppContext } from '@/AppContext.js'
import { collectionType } from '@/types.js'
import {
  formatDateTime,
} from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

export class JobsList extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(collectionType).isRequired,
    onCollectionUpdate: PropTypes.func.isRequired,
    page: PropTypes.number,
  }

  render() {
    const { jobs, onCollectionUpdate, page } = this.props

    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Number of Archives</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {jobs.map((collection) => (
            <Collection
              key={collection.id}
              collection={collection}
              onCollectionUpdate={onCollectionUpdate}
              page={page}
            />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

class Collection extends React.Component {
  static propTypes = {
    collection: collectionType.isRequired,
    onCollectionUpdate: PropTypes.func.isRequired,
    page: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  static contextType = AppContext.Context

  render() {
    const { collection } = this.props
    const { user } = this.context


    return (
      <Table.Row>
        <Table.Cell>
          <Link to={`/users/${collection.creator.id}`}>
            {collection.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell><b>{"Job "}{collection.id}</b></Table.Cell>
        <Table.Cell>{formatDateTime(collection.timestamp)}</Table.Cell>
        <Table.Cell>{collection.archives.length}</Table.Cell>
        <Table.Cell>
          <Link to={`/job/${collection.id}`}>
            <Button>Details</Button>
          </Link>{' '}
        </Table.Cell>
      </Table.Row>
    )
  }
}
