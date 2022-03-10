import { api } from '@/api.js';
import { AppContext } from '@/AppContext.js';
import { collectionType } from '@/types.js';
import {
  StepStatus,
  StepStatusLabel,
  StepNameLabel,
  StepName,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from '@/utils.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Table, Icon, Modal, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

export class CollectionsList extends React.Component {
  static propTypes = {
    collections: PropTypes.arrayOf(collectionType).isRequired,
    onCollectionUpdate: PropTypes.func.isRequired,
    page: PropTypes.number,
  };

  render() {
    const { collections, onCollectionUpdate, page } = this.props;

    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Creation Date</Table.HeaderCell>
            <Table.HeaderCell>Number of Archives</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {collections.map((collection) => (
            <Collection
              key={collection.id}
              collection={collection}
              onCollectionUpdate={onCollectionUpdate}
              page={page}
            />
          ))}
        </Table.Body>
      </Table>
    );
  }
}

class Collection extends React.Component {
  static propTypes = {
    collection: collectionType.isRequired,
    onCollectionUpdate: PropTypes.func.isRequired,
    page: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  static contextType = AppContext.Context;

  deleteCollection = (id) => api.delete_collection(id);

  handleDelete = (id) => {
    this.deleteCollection(id);
    this.props.onCollectionUpdate(this.props.page);
    this.setOpen(false);
  };

  setOpen = (value) => {
    this.setState({ open: value });
  };

  render() {
    const { collection } = this.props;
    const { user } = this.context;

    let deleteModal = (
      <Modal
        closeIcon
        open={this.state.open}
        trigger={<Button icon="remove circle" color="red" />}
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
      >
        <Header icon="archive" content="Delete a collection" />
        <Modal.Content>
          <p>Are you sure you want to delete this collection?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => this.setOpen(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button
            color="green"
            onClick={() => this.handleDelete(collection.id)}
          >
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );

    return (
      <Table.Row>
        <Table.Cell>{collection.id}</Table.Cell>
        <Table.Cell>
          <Link to={`/users/${collection.creator.id}`}>
            {collection.creator.username}
          </Link>
        </Table.Cell>
        <Table.Cell>{collection.title}</Table.Cell>
        <Table.Cell>{collection.description}</Table.Cell>
        <Table.Cell>{formatDateTime(collection.timestamp)}</Table.Cell>
        <Table.Cell>{collection.archives.length}</Table.Cell>
        <Table.Cell>
          <Link to={`/collection/${collection.id}`}>
            <Button>Details</Button>
          </Link>{' '}
          {deleteModal}
        </Table.Cell>
      </Table.Row>
    );
  }
}
