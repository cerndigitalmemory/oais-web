import { api } from '@/api.js'
import React from 'react'
import PropTypes from 'prop-types'
import { collectionType, archiveType } from '@/types.js'
import { Loader, Button, Modal } from 'semantic-ui-react'
import { PaginatedArchivesList } from '@/components/AddArchivesToCollection/AddPaginatedArchivesList.jsx'
import { sendNotification } from '@/utils.js'
/**
 * Allow adding Archives to a Tag by rendering a modal listing available Archives.
 */
export class AddArchives extends React.Component {
  static propTypes = {
    onArchiveAdd: PropTypes.func.isRequired, // The function to call after an archive has been added
    archives: PropTypes.arrayOf(archiveType), // List of archives to add to the collection
    collection: collectionType, // The collection in which archives will be added
  }

  constructor(props) {
    super(props)
    this.state = {
      archivesToAdd: [], // A list of all the archives selected to be added to that collection
      open: false, // When open is true then the modal is displayed
      loading: true, // When loading is true, then a spinner is displayed as long as the archives are loading
      newArchives: null, // Stores the loaded archives
      page: 1,
      totalArchives: 0,
    }
  }

  getArchives = (page) => api.archives(page)

  loadArchives = async (page) => {
    try {
      const { results: newArchives, count: totalArchives } =
        await this.getArchives(page)
      this.setState({
        newArchives: newArchives,
        page: page,
        totalArchives: totalArchives,
      })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message, 'error')
    }
  }

  componentDidMount() {
    this.loadArchives(this.state.page)
    this.setState({ loading: false })
  }

  setOpen = (value) => {
    this.setState({ open: value })
  }

  addArchive = (archive) => {
    const archivesToAdd = this.state.archivesToAdd
    let newList = archivesToAdd.concat(archive.id)
    if (archivesToAdd != 0) {
      archivesToAdd.map((checkedArchive) => {
        if (checkedArchive == archive.id) {
          console.log(archive.recid, ' already in the list!')
          newList = archivesToAdd
        }
      })
    }
    this.setState({ archivesToAdd: newList })
  }

  removeArchive = (archive) => {
    const archivesToAdd = this.state.archivesToAdd
    let newList = []
    archivesToAdd.map((uncheckedRecord) => {
      if (uncheckedRecord == archive.id) {
        newList = archivesToAdd.filter((item) => item != archive.id)
      }
    })
    this.setState({ archivesToAdd: newList })
  }

  handleArchivesAdd = () => {
    const archivesToAdd = this.state.archivesToAdd
    this.props.onArchiveAdd(archivesToAdd)
    this.setOpen(false)
  }

  render() {
    const { open, page, newArchives, totalArchives, loading } = this.state
    const { collection, archives } = this.props

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Button color="blue">Add Archives</Button>}
      >
        <Modal.Header>Add tags to the archive</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {loading || !newArchives ? (
              <div> {loadingSpinner} </div>
            ) : (
              <PaginatedArchivesList
                prevArchives={archives}
                newArchives={newArchives}
                addArchive={this.addArchive}
                removeArchive={this.removeArchive}
                loadArchives={this.loadArchives}
                page={page}
                totalArchives={totalArchives}
              />
            )}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => this.setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            content="Add archives"
            labelPosition="right"
            icon="checkmark"
            onClick={this.handleArchivesAdd}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
