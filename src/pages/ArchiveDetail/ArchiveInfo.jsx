import { archiveType } from '@/types.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Segment, Label, List } from 'semantic-ui-react';

/**
 * This component shows the general archive information
 * Gets the archive object and the ID as props and returns a header with the archive id
 * and a list of the basic information (source, recid, link)
 */
export class ArchiveInfo extends React.Component {
  static propTypes = {
    archive: archiveType,
    id: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { archive, id } = this.props;

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          General Archive Information
        </Label>
        <h1>Record {id}</h1>
        <List>
          <List.Item>
            <b>Source: </b> {archive.source}
          </List.Item>
          <List.Item>
            <b>ID: </b> {archive.recid}
          </List.Item>
          <List.Item>
            <b>Link: </b> <a href={archive.source_url}>{archive.source_url}</a>
          </List.Item>
        </List>
      </Segment>
    );
  }
}
