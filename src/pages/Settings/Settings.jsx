import React from 'react'
import { api } from '@/api.js'
import {
  Table,
  Loader,
  Button,
  Form,
  Grid,
  Input,
  Modal,
  Icon,
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { SourceStatusList } from '@/pages/Home/HomeSourceStatus.jsx'

import { sendNotification } from '@/utils.js'

export class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the settings are fetched from the API call
      settings: null, // Stores the settings
      userSettings: null,
    }
  }

  getSettings = () => api.settings()
  getUserSettings = () => api.getUserSettings()

  loadSettings = async () => {
    try {
      const userSettings = await this.getUserSettings()
      this.setState({ settings: {}, userSettings: userSettings })
    } catch (e) {
      sendNotification('Error while fetching settings', e.message, 'error')
    } finally {
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    this.loadSettings()
  }
  updateSettings() {
    this.setState({ loading: true })
    this.loadSettings()
  }

  render() {
    const { settings, userSettings, loading } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !userSettings ? (
          <div> {loadingSpinner} </div>
        ) : (
          <div>
            <h1>User Settings</h1>
            Here you can set various values and authentication tokens needed to
            allow the platform to access your private records. <br></br>Check
            the help on each line to learn how to get those values.
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Parameter</Table.HeaderCell>
                  <Table.HeaderCell width={12}>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {Object.entries(userSettings.profile).map(([key, value]) => (
                  <SettingItem
                    editable={true}
                    key={key}
                    title={key}
                    value={value}
                    updateSettings={this.updateSettings.bind(this)}
                  />
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        <h1>Sources availability</h1>
        The following table shows the availability of the various sources.<br></br><br></br>
        <SourceStatusList />
      </React.Fragment>
    )
  }
}

class SettingItem extends React.Component {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.node,
    updateSettings: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      showToken: false,
    }
  }

  toggleEditMode = async (e) => {
    e.preventDefault()
    this.setState({ editMode: !this.state.editMode })
  }

  seeToken = async (e) => {
    e.preventDefault()
    this.setState({ showToken: !this.state.showToken })
  }

  deleteToken = async (e) => {
    e.preventDefault()
    try {
      const newSettings = await api.setUserSettings(this.props.title, '')
      this.props.updateSettings()
    } catch (e) {
      sendNotification('Error while deleting token', e.message, 'error')
    }
  }

  render() {
    const { title, value, editable } = this.props

    let titleCell = title
    let valueCell = value
    const editButton = (
      <Button
        circular
        size="small"
        basic
        icon="pencil alternate"
        onClick={this.toggleEditMode}
      />
    )

    let token = this.props.value
    if (!this.state.showToken) {
      token = '******************'
    }

    if (editable) {
      if (value == '') {
        valueCell = (
          <Grid>
            <Grid.Column>
              <i>unset</i>
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right" width={3}>
              <Button.Group>{editButton}</Button.Group>
            </Grid.Column>
          </Grid>
        )
      } else {
        valueCell = (
          <Grid columns="equal">
            <Grid.Column>{token}</Grid.Column>
            <Grid.Column width={6} textAlign="right">
              <Button.Group>
                <Button
                  circular
                  size="small"
                  basic
                  icon="trash"
                  onClick={this.deleteToken}
                />
                <Button
                  circular
                  size="small"
                  basic
                  icon={this.state.showToken ? 'eye slash' : 'eye'}
                  onClick={this.seeToken}
                />
                {editButton}
              </Button.Group>
            </Grid.Column>
          </Grid>
        )
      }
    }

    const modalInfo = [
      {
        key: 'indico_api_key',
        value:
          'API token for indico pipeline. From your browser, login to the Indico instance, go to "Preferences" and then "API Token". Create new token, name can be anything. Select (at least) Everything (all methods) and Classic API (read only) as scopes. Note down the token and paste it here',
      },
      {
        key: 'codimd_api_key',
        value:
          'API token for codimd pipeline. To create packages out of CodiMD documents, go to https://codimd.web.cern.ch/, authenticate and after the redirect to the main page open your browser developer tools (CTRL+SHIFT+I), go to the "Storage" tab and under cookies copy the value of the connect.sid cookie. The Record ID for CodiMD document is the part of the url that follows the main domain address (e.g. in https://codimd.web.cern.ch/KabpdG3TTHKOsig2lq8tnw# the recid is KabpdG3TTHKOsig2lq8tnw)',
      },
    ]

    return (
      <Table.Row>
        <Table.Cell>
          <Grid columns={2}>
            <Grid.Column>{titleCell}</Grid.Column>
            <Grid.Column textAlign="right">
              {modalInfo.map(
                (info) =>
                  info.key == titleCell && (
                    <Modal
                      key={info.key}
                      trigger={<Icon link name="help circle" />}
                      header={info.key}
                      content={info.value}
                      actions={['Back']}
                    />
                  )
              )}
            </Grid.Column>
          </Grid>
        </Table.Cell>
        <Table.Cell>
          {this.state.editMode ? (
            <EditKeyForm
              size="small"
              title={title}
              value={value}
              toggleEdit={this.toggleEditMode.bind(this)}
              updateSettings={this.props.updateSettings}
            />
          ) : (
            valueCell
          )}
        </Table.Cell>
      </Table.Row>
    )
  }
}

class EditKeyForm extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.node,
    toggleEdit: PropTypes.func,
    updateSettings: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      editValue: this.props.value,
    }
  }

  handleValueChange = (event) => {
    this.setState({ editValue: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const newSettings = await api.setUserSettings(
        this.props.title,
        this.state.editValue
      )
      if (this.props.value !== this.state.editValue) {
        sendNotification(this.props.title, 'Changed successfully!', 'success')
      }
      this.props.updateSettings()
    } catch (e) {
      sendNotification('Error while modifying settings', e.message, 'error')
    }
  }

  render() {
    const { title, value } = this.props
    return (
      <Form>
        <Grid stackable columns="equal">
          <Grid.Column>
            <Form.Field
              size="small"
              control={Input}
              value={this.state.editValue}
              onChange={this.handleValueChange}
              placeholder={'Enter ' + title + ' here...'}
            />
          </Grid.Column>
          <Grid.Column textAlign="right" width={3}>
            <Button.Group>
              <Button
                circular
                basic
                icon="undo"
                size="small"
                onClick={this.props.toggleEdit}
              />
              <Button
                primary
                circular
                size="small"
                onClick={this.handleSubmit}
                icon="check"
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Form>
    )
  }
}
