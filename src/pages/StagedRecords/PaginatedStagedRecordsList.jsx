import { api } from '@/api.js'
import { sendNotification, formatDateTime } from '@/utils.js'
import PropTypes, { string } from 'prop-types'
import { archiveType, archiveTypeDetailed, collectionType } from '@/types.js'
import React from 'react'
import {
  Header,
  Table,
  Button,
  Icon,
  Grid,
  Popup,
  Pagination,
  Dropdown,
  Loader,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedRecordsList extends React.Component {
  static propTypes = {
    stagedArchives: PropTypes.arrayOf(archiveTypeDetailed),
    onArchiveUpdate: PropTypes.func.isRequired,
    totalStagedArchives: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
  }

  stageArchive = async (archive) => {
    await api.unstageArchive(archive.id)
  }

  handleArchiving = async () => {
    const archives = this.props.stagedArchives
    try {
      archives.map((archive) => {
        this.stageArchive(archive)
      })
      sendNotification('Archives archived successfully')
    } catch (e) {
      sendNotification('Error while archiving', e.message)
    } finally {
      this.props.onArchiveUpdate()
    }
  }

  render() {
    const { stagedArchives, onArchiveUpdate, totalRecords, page } = this.props


    return (
      <div>
        <RecordsList archives={stagedArchives} onArchiveUpdate={onArchiveUpdate} />
        <br />
        <Grid columns={1} stackable>
          
          <Grid.Column floated="right" textAlign="right">
            <Button primary onClick={this.handleArchiving}>
              Archive All
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

class RecordsList extends React.Component {
  /* 
    Shows the results of the Harvest search including the available actions
  */

  static propTypes = {
    archives: PropTypes.arrayOf(archiveTypeDetailed).isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      loading: true,
    }
  }

  getCollections = () => api.get_all_tags()

  loadCollections = async () => {
    try {
      const tags = await this.getCollections()
      this.setState({
        tags: tags,
      })
    } catch (e) {
      sendNotification('Error while fetching settings', e.message)
    }
  }

  updateCollections = () => {
    this.loadCollections()
  }

  componentDidMount() {
    this.loadCollections()
    this.setState({ loading: false })
  }

  render() {
    const { tags, loading } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !tags ? (
          <div> {loadingSpinner} </div>
        ) : (
          <div>
            <Table>
              {this.props.archives.length > 0 ? (
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width="9">Title</Table.HeaderCell>
                    <Table.HeaderCell width="2" textAlign="right">
                      Record ID
                    </Table.HeaderCell>
                    <Table.HeaderCell width="4" textAlign="right">
                      Tag
                    </Table.HeaderCell>
                    <Table.HeaderCell width="1" textAlign="center">
                      {' '}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
              ) : null}
              <Table.Body>
                {this.props.archives.map((archive, i) => (
                  <Record
                    key={i}
                    archive={archive}
                    onArchiveUpdate={this.props.onArchiveUpdate}
                    tags={tags}
                    updateCollections={this.updateCollections}
                  />
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </React.Fragment>
    )
  }
}

class Record extends React.Component {
  static propTypes = {
    archive: archiveTypeDetailed.isRequired,
    onArchiveUpdate: PropTypes.func.isRequired,
    updateCollections: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(collectionType),
  }

  constructor(props) {
    super(props)
    this.state = {
      tagged: false,
      selectedTags: [],
      loading: true,
      tagText: '',
    }
  }

  componentDidMount() {
    if (this.state.loading) {
      this.getSelectedTags()
    }
    this.setState({ loading: false })
  }

  getSelectedTags() {
    var selectedTags = []
    this.props.archive.collections.map(
      (tag) => (selectedTags = selectedTags.concat(tag.id))
    )
    this.setState({ selectedTags: selectedTags })
  }

  handleDelete = async () => {
    await api.deleteArchive(this.props.archive.id)
    this.props.onArchiveUpdate()
  }

  handleSearchChange = async (e, { value, searchQuery }) => {
    e.preventDefault()
    this.setState({ tagText: searchQuery })
  }

  handleSelect = async (e, { value, searchQuery }) => {
    e.preventDefault()
    this.setState({ loading: true })
    // if the new value is bigger than the old one, a new tag has been selected
    if (value.length > this.state.selectedTags.length) {
    // find the different tag between the lists and add the archive 
    const collection = value.filter(x => !this.state.selectedTags.includes(x))
    if(typeof(collection[0]) == typeof(1)){
      // if the new value is a number add the archive to the collection
      // otherwise the new value is a string and it has beed added by the user (by creating new tag)
      await api.add_archives_to_collection(collection[0], this.props.archive.id)
      this.setState({selectedTags: value, loading: false})
    }
    
    }
    if (value.length < this.state.selectedTags.length) {
    //find the different tag between the lists and remove the archive 
    const collection = this.state.selectedTags.filter(x => !value.includes(x))
    await api.remove_archives_from_collection(collection[0], this.props.archive.id)
    this.setState({selectedTags: value, loading: false})
  }
  }

  handleAddition = async (e, {searchQuery}) => {
    // if a new tag has been created
    e.preventDefault()
    this.setState({ loading: true })
    try {      
      const collection = await api.create_collection(searchQuery, '', null)
      const newSelectedTags = this.state.selectedTags.concat(collection.id)
      this.props.updateCollections()
      await api.add_archives_to_collection(collection.id, this.props.archive.id)
      this.setState({ selectedTags: newSelectedTags, tagText: '' })

    } catch (exception) {
      sendNotification('Error while fetching settings', exception.message)
    } finally {
      this.setState({ loading: false })
    }
  }



  render() {
    const { archive, tags } = this.props
    const { loading, tagText, selectedTags } = this.state

    var tagOptions = tags
      .map((tag) => ({
        key: tag.id,
        text: tag.title,
        value: tag.id,
      }))
    

    let archivedRecord = null
    if (archive.duplicates.length > 0) {
      let timeWord = 'time'
      if (archive.duplicates.length > 1) {
        timeWord = 'times'
      }
      archivedRecord = (
        <Popup
          flowing
          hoverable
          trigger={<Icon color="grey" name="question circle outline" />}
        >
          <Grid centered divided>
            <Grid.Column>
              <Grid.Row>
                <Header>
                  {' '}
                  This archive exists {archive.duplicates.length} {timeWord}.
                </Header>
              </Grid.Row>
              {archive.duplicates.map((duplicate) => (
                <ShowArchive key={duplicate.id} archive={duplicate} />
              ))}
            </Grid.Column>
          </Grid>
        </Popup>
      )
    }

    let deleteButton = (
      <Button icon="remove" color="red" onClick={this.handleDelete} />
    )

    
        
    

    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell textAlign="left">
            <b>{archive.title}</b> ({archive.source})
          </Table.Cell>
          <Table.Cell textAlign="right">{archive.recid}</Table.Cell>
          <Table.Cell textAlign="right">
          <Dropdown
            placeholder="Add tag"
            fluid
            multiple
            search
            selection
            closeOnChange
            loading={loading}
            options={tagOptions}
            onAddItem={this.handleAddition.bind(this)}
            allowAdditions
            onChange={this.handleSelect.bind(this)}
            onSearchChange={this.handleSearchChange.bind(this)}
            value={selectedTags}
            searchQuery={tagText}
            minCharacters={2}
          />
          </Table.Cell>
          <Table.Cell textAlign="right">{deleteButton}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }
}

class ShowArchive extends React.Component {
  static propTypes = {
    archive: archiveType,
  }

  render() {
    const { archive } = this.props

    return (
      <Grid.Row>
        <Link to={`/archive/${archive.id}`}>
          {'Archive '}
          {archive.id}
        </Link>
        {' harvested on '}
        {formatDateTime(archive.timestamp)}
      </Grid.Row>
    )
  }
}
