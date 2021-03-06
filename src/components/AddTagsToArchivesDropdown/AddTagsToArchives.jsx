import { api } from '@/api.js'
import { sendNotification } from '@/utils.js'
import { archiveTypeDetailed, archiveType, collectionType } from '@/types.js'
import PropTypes, { arrayOf } from 'prop-types'
import React from 'react'
import { Dropdown, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

export class AddTagsToArchives extends React.Component {
  static propTypes = {
    archive: PropTypes.oneOfType([archiveTypeDetailed, archiveType]),
    // optional props: if they are not provided, then this component uses its own api to request all the tags
    allTags: arrayOf(collectionType),
    updateTags: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      tagged: false,
      // if allTags prop is populated initiliaze this state with that value
      tags: !this.props.allTags ? [] : this.props.allTags,
      selectedTags: [],
      loading: true,
      tagText: '',
      redirect: null,
    }
  }

  getCollections = () => api.getAllTags()

  loadCollections = async () => {
    try {
      const tags = await this.getCollections()
      this.setState({
        tags: tags,
      })
    } catch (e) {
      sendNotification('Error while fetching settings', e.message, 'error')
    }
  }

  getArchiveCollections = async () => {
    var selectedTags = []
    try {
      const tags = await api.getArchiveCollections(this.props.archive.id)
      tags.results.map((tag) => (selectedTags = selectedTags.concat(tag.id)))
      this.setState({ selectedTags: selectedTags })
    } catch (e) {
      sendNotification('Error while fetching collections', e.message, 'error')
    }
  }

  updateCollections = async () => {
    this.setState({ loading: true })
    if (this.props.updateTags || this.props.allTags) {
      await this.props.updateTags()
      this.setState({ tags: this.props.allTags })
    } else {
      this.loadCollections()
    }
    this.setState({ loading: false })
  }

  componentDidMount() {
    if (this.state.loading) {
      if (this.props.updateTags || this.props.allTags) {
        // if this component is called with allTags and update tags props
        this.getSelectedTags()
      } else {
        this.loadCollections()
        this.getSelectedTags()
      }
    }
    this.setState({ loading: false })
  }

  componentDidUpdate(prevProps) {
    // if this.props.tags has new entries then update the state
    if (this.props.allTags !== prevProps.allTags) {
      this.setState({ tags: this.props.allTags })
    }
  }

  getSelectedTags() {
    var selectedTags = []
    if (this.props.archive.collections) {
      this.props.archive.collections.map(
        (tag) => (selectedTags = selectedTags.concat(tag.id))
      )
      this.setState({ selectedTags: selectedTags })
    } else {
      this.getArchiveCollections()
    }
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
      const collection = value.filter(
        (x) => !this.state.selectedTags.includes(x)
      )
      if (typeof collection[0] == typeof 1) {
        // if the new value is a number add the archive to the collection
        // otherwise the new value is a string and it has beed added by the user (by creating new tag)
        await api.addArchivesToCollection(collection[0], this.props.archive.id)
        this.setState({ selectedTags: value, loading: false, tagText: '' })
      }
    }
    if (value.length < this.state.selectedTags.length) {
      //find the different tag between the lists and remove the archive
      const collection = this.state.selectedTags.filter(
        (x) => !value.includes(x)
      )
      await api.removeArchivesFromCollection(
        collection[0],
        this.props.archive.id
      )
      this.setState({ selectedTags: value, loading: false, tagText: '' })
    }
  }

  handleAddition = async (e, { searchQuery }) => {
    // if a new tag has been created
    e.preventDefault()
    this.setState({ loading: true })
    var tagTitles = []
    this.state.tags.map((tag) => {
      tagTitles.push(tag.title)
    })
    // checks if there is a tag with the same name
    if (tagTitles.includes(searchQuery)) {
      sendNotification(
        'You already have a tag called "' + searchQuery + '"',
        '',
        'warning'
      )
      this.setState({ loading: false })
    } else {
      try {
        const collection = await api.collectionCreate(searchQuery, '', null)
        const newSelectedTags = this.state.selectedTags.concat(collection.id)
        this.updateCollections()
        await api.addArchivesToCollection(collection.id, this.props.archive.id)
        this.setState({ selectedTags: newSelectedTags, tagText: '' })
      } catch (exception) {
        sendNotification(
          'Error while creating collection',
          exception.message,
          'error'
        )
      } finally {
        this.setState({ loading: false })
      }
    }
  }

  handleLabelClick = (e, { value }) => {
    e.preventDefault()
    this.setState({ redirect: value })
  }

  render() {
    const { loading, tagText, selectedTags, tags, redirect } = this.state

    var tagOptions = tags.map((tag) => ({
      key: tag.id,
      text: tag.title,
      value: tag.id,
    }))

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {redirect && <Redirect to={`/collection/${redirect}`}></Redirect>}
        {loading || !tags ? (
          <div> {loadingSpinner} </div>
        ) : (
          <Dropdown
            placeholder="Add tag"
            multiple
            search
            selection
            closeOnChange
            loading={loading}
            options={tagOptions}
            onAddItem={this.handleAddition.bind(this)}
            onLabelClick={this.handleLabelClick.bind(this)}
            allowAdditions
            onChange={this.handleSelect.bind(this)}
            onSearchChange={this.handleSearchChange.bind(this)}
            value={selectedTags}
            searchQuery={tagText}
            minCharacters={2}
          />
        )}
      </React.Fragment>
    )
  }
}
