import { api } from '@/api.js'
import { JobInfo } from '@/pages/JobDetailsPage/JobInfo.jsx'
import { JobArchives } from '@/pages/JobDetailsPage/JobArchives.jsx'
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
export class JobDetails extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired, // Gets the id from the url and sets it as prop
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the archive and steps are fetched from the API call
      job: null, // Stores the archive details
    }
  }

  getJob = (id, internal) => api.collection(id, internal) // API call to get archive details

  loadJob = async () => {
    try {
      const job = await this.getJob(this.props.match.params.id, true)
      this.setState({ job: job })
    } catch (e) {
      sendNotification('Error while fetching job', e.message, 'error')
    }
  }

  componentDidMount() {
    this.loadJob()
    this.setState({ loading: false })
  }

  render() {
    const { id } = this.props.match.params
    const { loading, job } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !job ? (
          <div> {loadingSpinner} </div>
        ) : (
          <JobInfo job={job} id={id} />
        )}
        {loading || !job ? (
          <div> {loadingSpinner} </div>
        ) : (
          <JobArchives job={job} />
        )}
      </React.Fragment>
    )
  }
}
