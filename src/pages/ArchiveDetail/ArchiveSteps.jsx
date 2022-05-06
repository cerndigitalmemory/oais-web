import { api } from '@/api.js'
import { PaginatedStepsList } from '@/pages/ArchiveDetail/PaginatedStepsList.jsx'
import { ArchiveInfo } from '@/pages/ArchiveDetail/ArchiveInfo.jsx'
import { StepsPipeline } from '@/pages/ArchiveDetail/PipelineStatusFlow.jsx'
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
export class ArchiveSteps extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired, // Gets the id from the url and sets it as prop
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the archive and steps are fetched from the API call
      steps: [], // Stores the steps of the current archive
      archive: null, // Stores the archive details
      collections: [],
      loadingCollections: true,
    }
  }

  getArchive = (id) => api.archive_details(id) // API call to get archive details

  getSteps = (id) => api.get_archive_steps(id) // API call to get steps

  getCollections = (id) => api.getArchiveCollections(id)

  loadArchive = async () => {
    try {
      const archive = await this.getArchive(this.props.match.params.id)
      this.setState({ archive: archive })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message, 'error')
    }
  }

  loadSteps = async () => {
    try {
      const steps = await this.getSteps(this.props.match.params.id)
      this.setState({ steps: steps })
    } catch (e) {
      sendNotification('Error while fetching steps', e.message, 'error')
    }
  }

  loadCollections = async () => {
    this.setState({ loadingCollections: true })
    try {
      const { results: collections } = await this.getCollections(
        this.props.match.params.id
      )
      this.setState({ collections })
    } catch (e) {
      sendNotification('Error while fetching collections', e.message, 'error')
    } finally {
      this.setState({ loadingCollections: false })
    }
  }
  // This function gets called periodically to refresh the archive status and fetch updates
  refresh() {
    // Load the steps again in case something else got done in the meantime
    this.loadSteps()
  }

  // This is used to keep a reference to setInterval callback
  // (used to keep refreshing the status of the Archive) and eventually clear (disable) it
  refreshInterval = null

  componentDidMount() {
    this.loadCollections()
    this.loadArchive()
    this.loadSteps()
    // Let's call refresh every 3 seconds to update the status of the Archive
    this.refreshInterval = setInterval(() => this.refresh(), 3000)
    this.setState({ loading: false })
    // Loads steps and archive details and then sets loading state to false
  }

  componentWillUnmount() {
    // Once we're done, stop with period call for refreshes
    clearInterval(this.refreshInterval)
  }

  render() {
    const { id } = this.props.match.params
    const { loading, steps, archive, collections, loadingCollections } =
      this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !archive || loadingCollections ? (
          <div> {loadingSpinner} </div>
        ) : (
          <ArchiveInfo
            archive={archive}
            id={id}
            onCollectionUpdate={this.loadCollections}
            collections={collections}
          />
        )}
        {loading || !archive || !steps ? (
          <div> {loadingSpinner} </div>
        ) : (
          <StepsPipeline archive={archive} steps={steps} />
        )}
        {loading || !archive || !steps ? (
          <div> {loadingSpinner} </div>
        ) : (
          <PaginatedStepsList archive={archive} steps={steps} />
        )}
      </React.Fragment>
    )
  }
}
