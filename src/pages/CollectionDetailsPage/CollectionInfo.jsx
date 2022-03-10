import { collectionType } from '@/types.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Segment, Label, List } from 'semantic-ui-react';
import { formatDateTime } from '@/utils.js';

/**
 * This component shows the general archive information
 * Gets the archive object and the ID as props and returns a header with the archive id
 * and a list of the basic information (source, recid, link)
 */
export class CollectionInfo extends React.Component {
  static propTypes = {
    collection: collectionType,
    id: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { collection, id } = this.props;

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          General Collection Information
        </Label>
        <h1>Collection {id}</h1>
        <List>
          <List.Item>
            <b>Name: </b> {collection.title}
          </List.Item>
          <List.Item>
            <b>Creation Date: </b> {formatDateTime(collection.timestamp)}
          </List.Item>
          <List.Item>
            <b>Last modification: </b>
            {formatDateTime(collection.last_modification_date)}
          </List.Item>
          <List.Item>
            <b>Description: </b> {collection.description}
          </List.Item>
        </List>
      </Segment>
    );
  }
}
