import { api } from '@/api.js';
import { sendNotification } from '@/utils.js';
import PropTypes from 'prop-types';
import { Divider, Header, Table, Segment } from 'semantic-ui-react';
import React from 'react';

export class SIPDetailPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    try {
      const record = await api.record(id);
      this.setState({ record });
    } catch (e) {
      sendNotification('Error while fetching record details', e.message);
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { record } = this.state;
    const mock = { date: '15.09.2021 15:45', size: 12902 };
    return (
      <React.Fragment>
        <h1>Archive {record.id}</h1>
        <Header as="h2">SIP Details</Header>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2}>Title</Table.Cell>
              <Table.Cell>{record.title}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Source</Table.Cell>
              <Table.Cell>{record.source}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Record</Table.Cell>
              <Table.Cell>{record.recid}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Header as="h2">Actions</Header>
        <Segment>
          <Header as="h3">Step 1</Header>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={2}>Action</Table.Cell>
                <Table.Cell>SIP Creation</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={2}>Date</Table.Cell>
                <Table.Cell>{mock.date}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Size</Table.Cell>
                <Table.Cell>{mock.size}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Divider section />

          <Header as="h3">Step 2</Header>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={2}>Action</Table.Cell>
                <Table.Cell>Uploaded to CDS</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Source</Table.Cell>
                <Table.Cell>{mock.date}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Record</Table.Cell>
                <Table.Cell>{mock.size}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
      </React.Fragment>
    );
  }
}
