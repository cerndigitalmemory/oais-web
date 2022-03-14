import { api } from '@/api.js'
import React from 'react'
import { archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import { sendNotification } from '@/utils.js'
import {
  Loader,
  Segment,
  Label,
  Grid,
  Form,
  Header,
  Button,
  Input,
  Modal,
} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

export class EditManifests extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired, // Gets the id from the url and sets it as prop
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the archive and steps are fetched from the API call
      archive: null, // Stores the archive details
    }
  }

  getArchive = (id) => api.archive_details(id) // API call to get archive details

  loadArchive = async () => {
    try {
      const archive = await this.getArchive(this.props.match.params.id)
      this.setState({ archive: archive })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message)
    }
  }

  componentDidMount() {
    this.loadArchive()
    this.setState({ loading: false })
  }

  render() {
    const { id } = this.props.match.params
    const { loading, archive } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !archive ? (
          <div> {loadingSpinner} </div>
        ) : (
          <JSONEditForm archive={archive} id={id} />
        )}
      </React.Fragment>
    )
  }
}

class JSONEditForm extends React.Component {
  static propTypes = {
    archive: archiveType,
    id: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      manifest: '',
      goBack: false,
      openExit: false,
      openSave: false,
    }
  }

  componentDidMount() {
    const sipJSON = this.props.archive.manifest
    const manifest = sipJSON[0].tool.params
    this.setState({ manifest: manifest })
  }

  onValueChange = (newKey, newValue) => {
    var newData = {}
    newData[newKey] = newValue

    const oldData = this.state.manifest
    Object.assign(oldData, newData)
  }

  saveManifest = async () => {
    const { id, archive } = this.props
    const { manifest } = this.state
    try {
      const sipJSON = archive.manifest

      sipJSON[0].tool.params = manifest

      await api.saveManifest(id, sipJSON)
      sendNotification('Save successful', 'Modifications are saved')
      this.setState({ goBack: true })
      this.setState({ openSave: false })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message)
    }
  }

  goBack = () => {
    // Handles the redirect state to the previous page
    this.setState({ goBack: true })
  }

  openExitModal = () => {
    this.setState({ openExit: true })
  }

  closeExitModal = () => {
    this.setState({ openExit: false })
  }

  openSaveModal = () => {
    this.setState({ openSave: true })
  }

  closeSaveModal = () => {
    this.setState({ openSave: false })
  }

  render() {
    const { id } = this.props
    const { manifest, goBack, openExit, openSave } = this.state

    let goBackButton
    if (goBack) {
      goBackButton = <Redirect to={`/archive/${id}`} />
    } else {
      goBackButton = (
        <Button inverted color="green" onClick={this.goBack}>
          Yes, go back
        </Button>
      )
    }

    let saveAndBackButton
    if (goBack) {
      saveAndBackButton = <Redirect to={`/archive/${id}`} />
    } else {
      saveAndBackButton = (
        <Button
          inverted
          color="green"
          onClick={this.saveManifest}
          type="submit"
        >
          Save
        </Button>
      )
    }

    let backButtonModal = (
      <Modal
        basic
        onClose={this.closeExitModal}
        onOpen={this.openExitModal}
        open={openExit}
        size="small"
        trigger={
          <Button inverted color="red">
            Back
          </Button>
        }
      >
        <Header>Return to archive {id} details page</Header>
        <Modal.Content>
          <p>Do you want to discard changes and return?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={this.closeExitModal}>
            No, continue editing
          </Button>
          {goBackButton}
        </Modal.Actions>
      </Modal>
    )

    let saveButtonModal = (
      <Modal
        basic
        onClose={this.closeSaveModal}
        onOpen={this.openSaveModal}
        open={openSave}
        size="small"
        trigger={
          <Button primary type="submit">
            Save
          </Button>
        }
      >
        <Header>Save changes for archive {id}</Header>
        <Modal.Content>
          <p>Do you want to save changes?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={this.closeSaveModal}>
            Continue Editing
          </Button>
          {saveAndBackButton}
        </Modal.Actions>
      </Modal>
    )

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Edit Manifest file
        </Label>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={10}>
              <h1>Edit manifest file for Record {id}</h1>
            </Grid.Column>
            <Grid.Column floated="right" width={3} textAlign="right">
              {backButtonModal}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form>
          <Header>Manifest editor form</Header>
          {Object.entries(manifest).map(([key, value]) => (
            <FormField
              key={key}
              title={key}
              value={value}
              onValueChange={this.onValueChange}
            />
          ))}
          {saveButtonModal}
        </Form>
      </Segment>
    )
  }
}

class FormField extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.node,
    onValueChange: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.value ?? '',
    }
  }

  handleValueChange = (event) => {
    const { title } = this.props
    this.setState({ text: event.target.value })
    this.props.onValueChange(title, event.target.value)
  }

  render() {
    const { title, value } = this.props

    let formField
    if (
      title == 'target' ||
      title == 'source_path' ||
      title == 'source_base_path' ||
      title == 'author'
    ) {
      formField = (
        <Form.Field
          control={Input}
          value={this.state.text}
          onChange={this.handleValueChange}
          label={title}
        />
      )
    } else {
      formField = (
        <Form.Field
          control={Input}
          value={value ?? ''}
          disabled
          label={title}
        />
      )
    }

    return <React.Fragment>{formField}</React.Fragment>
  }
}
