import { api } from '@/api.js'
import React from 'react'
import PropTypes from 'prop-types'
import { archiveType } from '@/types.js'
import { sendNotification } from '@/utils.js'
import {
  Loader,
  Segment,
  Label,
  Form,
  Header,
  Button,
  Input,
  Modal,
} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { AddArchives } from '@/components/AddArchivesToCollection/AddArchives.jsx'

/**
 * This component creates a new collection. The user can add a name of the collection, a description
 * and archives.
 *
 */

export class CreateCollection extends React.Component {
  static propTypes = {
    onCollectionCreation: PropTypes.func.isRequired, //What to do after the collection is created
    label: PropTypes.string, // Label of the "Create collection" button
    defaultArchives: PropTypes.arrayOf(PropTypes.number), // A list of archive ids to add to the collection
    addArchives: PropTypes.bool.isRequired, //if True the user can add more archives to the collection, if False he can only pre-select and add from the defaultArchives
  }
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      archives: [],
      open: false,
      loading: true,
      label: 'Create New Tag',
    }
  }

  loadArchives() {
    if (this.props.defaultArchives) {
      this.setState({ archives: this.props.defaultArchives })
    }
  }

  loadLabel() {
    if (this.props.label) {
      this.setState({ label: this.props.label })
    }
  }

  componentDidMount() {
    this.loadArchives()
    this.loadLabel()
    this.setState({ loading: false })
  }

  createCollection = (title, description, archives) =>
    api.create_collection(title, description, archives)

  handleSubmit = () => {
    const { title, description, archives } = this.state
    this.createCollection(title, description, archives)
    this.props.onCollectionCreation()
    this.setOpen(false)
  }

  setOpen = (value) => {
    if (value) {
      this.loadArchives()
    }

    this.setState({ open: value })
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value })
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value })
  }

  handleArchiveAddition = (archives) => {
    this.setState({ archives: archives })
  }

  render() {
    const { open, title, archives, label, loading } = this.state
    const { user } = this.context
    const { addArchives } = this.props

    let addArchivesButton
    if (addArchives) {
      addArchivesButton = (
        <AddArchives
          onArchiveAdd={this.handleArchiveAddition}
          archives={this.state.archives}
        />
      )
    }

    const loadingSpinner = <Loader inverted>Loading</Loader>

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Button primary>{label}</Button>}
      >
        <Modal.Header>Create a new collection</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Tag Details</Header>
            <Form>
              <Form.Field
                control={Input}
                value={this.state.title}
                onChange={this.handleTitleChange}
                label="Title"
                placeholder="Title"
              />
              <Form.TextArea
                control={Input}
                value={this.state.description}
                onChange={this.handleDescriptionChange}
                label="Description"
                placeholder="Add a description..."
              />
              <Form.Field>
                {loading ? (
                  <div> {loadingSpinner} </div>
                ) : (
                  <div>
                    {addArchivesButton}{' '}
                    <p>{archives.length} archives selected</p>
                  </div>
                )}
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => this.setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            content="Create Tag"
            onClick={() => this.handleSubmit()}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
