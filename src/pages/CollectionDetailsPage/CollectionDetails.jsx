import { api } from '@/api.js'
import { CollectionInfo } from '@/pages/CollectionDetailsPage/CollectionInfo.jsx'
import { CollectionArchives } from '@/pages/CollectionDetailsPage/CollectionArchives.jsx'
import React from 'react'
import PropTypes from 'prop-types'
import { sendNotification } from '@/utils.js'
import { Loader } from 'semantic-ui-react'

/**
 * This page shows the details of each harvested archive.
 * It contains the ArchiveInfo component which includes basic information about the archive (recid, source, link)
 * It contains the StepsPipeline component which includes an animation of the completed or pending steps.
 * It contains the PaginatedStepsList which is a list of each step with all relevant information.
 *
 */
export class CollectionDetails extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired, // Gets the id from the url and sets it as prop
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the archive and steps are fetched from the API call
      collection: null, // Stores the archive details
    }
  }

  getCollection = (id) => api.get_collection(id) // API call to get archive details

  addArchives = (id, archives) => api.add_archives_to_collection(id, archives)

  removeArchives = (id, archives) =>
    api.remove_archives_from_collection(id, archives)

  loadCollection = async () => {
    try {
      const collection = await this.getCollection(this.props.match.params.id)
      this.setState({ collection: collection })
    } catch (e) {
      sendNotification('Error while fetching collection', e.message)
    }
  }

  addArchivesToCollection = async (archives) => {
    try {
      this.setState({ loading: true })
      await this.addArchives(this.props.match.params.id, archives)
      this.loadCollection()
      this.setState({ loading: false })
    } catch (e) {
      sendNotification('Error while adding archives', e.message)
      this.setState({ loading: false })
    }
  }

  removeArchivesFromCollection = async (archives) => {
    try {
      this.setState({ loading: true })
      await this.removeArchives(this.props.match.params.id, archives)
      this.loadCollection()
      this.setState({ loading: false })
    } catch (e) {
      sendNotification('Error while removing archives', e.message)
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    this.loadCollection()
    this.setState({ loading: false })
  }

  render() {
    const { id } = this.props.match.params
    const { loading, collection } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !collection ? (
          <div> {loadingSpinner} </div>
        ) : (
          <CollectionInfo collection={collection} id={id} />
        )}
        {loading || !collection ? (
          <div> {loadingSpinner} </div>
        ) : (
          <CollectionArchives
            collection={collection}
            onArchiveAdd={this.addArchivesToCollection}
            onArchiveRemoval={this.removeArchivesFromCollection}
          />
        )}
      </React.Fragment>
    )
  }
}
