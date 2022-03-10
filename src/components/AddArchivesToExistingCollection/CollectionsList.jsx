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
    addCollection: PropTypes.func.isRequired,
    removeCollection: PropTypes.func.isRequired,
    checked: PropTypes.number,
  };

  render() {
    const { collections, onCollectionUpdate, page, checked } = this.props;

    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Number of Archives</Table.HeaderCell>
            <Table.HeaderCell>Select Collection</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {collections.map((collection) => (
            <Collection
              key={collection.id}
              collection={collection}
              onCollectionUpdate={onCollectionUpdate}
              page={page}
              addCollection={this.props.addCollection}
              removeCollection={this.props.removeCollection}
              checked={checked}
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
    addCollection: PropTypes.func.isRequired,
    removeCollection: PropTypes.func.isRequired,
    checked: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  static contextType = AppContext.Context;

  handleCollectionCheck = () => {
    const { checked, collection, addCollection, removeCollection } = this.props;
    if (checked == collection.id) {
      removeCollection(collection);
    } else {
      addCollection(collection);
    }
  };

  render() {
    const { collection, checked } = this.props;
    const { user } = this.context;

    let checkButton;

    if (checked == collection.id) {
      checkButton = (
        <Button
          circular
          color="olive"
          icon="check"
          onClick={this.handleCollectionCheck}
          title="Check"
        />
      );
    } else {
      checkButton = (
        <Button
          circular
          basic
          color="olive"
          icon="check"
          onClick={this.handleCollectionCheck}
          title="Check"
        />
      );
    }

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

        <Table.Cell>{collection.archives.length}</Table.Cell>
        <Table.Cell>{checkButton}</Table.Cell>
      </Table.Row>
    );
  }
}
