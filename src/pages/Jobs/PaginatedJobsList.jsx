import { collectionType } from '@/types.js'
import { JobsList } from '@/pages/Jobs/JobsList.jsx'
import { PageControls } from '@/pages/Jobs/PageControls.jsx'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedJobsList extends React.Component {
  static propTypes = {
    loadJobs: PropTypes.func.isRequired,
    jobs: PropTypes.arrayOf(collectionType).isRequired,
    page: PropTypes.number.isRequired,
    totalJobs: PropTypes.number,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { jobs, page, totalJobs, loadJobs } = this.props
    const jobsPerPage = 10
    let pageCount = Math.ceil(totalJobs / jobsPerPage)

    return (
      <div>
        {totalJobs == 0 ? (
          <div> No jobs found </div>
        ) : (
          <JobsList jobs={jobs} onCollectionUpdate={loadJobs} page={page} />
        )}

        {totalJobs > jobsPerPage && (
          <PageControls
            page={page}
            onChange={loadJobs}
            totalPages={pageCount}
          />
        )}
      </div>
    )
  }
}
