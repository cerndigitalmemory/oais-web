import React from 'react';
import { api } from '@/api.js';
import { Segment, Table, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { sendNotification } from '@/utils.js';

export class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // Shows a loading spinner till the settings are fetched from the API call
      settings: null, // Stores the settings
    };
  }

  getSettings = () => api.settings();

  loadSettings = async () => {
    try {
      const settings = await this.getSettings();
      this.setState({ settings: settings });
    } catch (e) {
      sendNotification('Error while fetching settings', e.message);
    }
  };

  componentDidMount() {
    this.loadSettings();
    this.setState({ loading: false });
  }

  render() {
    const { settings, loading } = this.state;

    const loadingSpinner = <Loader active inline="centered" />;

    return (
      <React.Fragment>
        {loading || !settings ? (
          <div> {loadingSpinner} </div>
        ) : (
          <div>
            <h1>Settings</h1>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Parameter</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {Object.entries(settings).map(([key, value]) => (
                  <SettingItem key={key} title={key} value={value} />
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </React.Fragment>
    );
  }
}

class SettingItem extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.node,
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { title, value } = this.props;

    return (
      <Table.Row>
        <Table.Cell>{title}</Table.Cell>
        <Table.Cell>{value}</Table.Cell>
      </Table.Row>
    );
  }
}
