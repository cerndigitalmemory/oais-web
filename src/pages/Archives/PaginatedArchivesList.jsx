import { ArchivesList } from '@/pages/Archives/ArchivesList.jsx'
import { PageControls } from '@/pages/Archives/PageControls.jsx'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedArchivesList extends React.Component {
  static propTypes = {
    getArchives: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      archives: [],
      page: 1,
      totalArchives: 0,
      loading: true,
    }
  }

  handleArchiveUpdate = (newArchive) => {
    const archives = this.state.archives.map((archive) => {
      if (archive.id === newArchive.id) {
        return newArchive
      } else {
        return archive
      }
    })
    this.setState({ archives })
  }

  loadArchives = async (page = 1) => {
    try {
      const { results: archives, count: totalArchives } =
        await this.props.getArchives(page, this.props.filter)
      this.setState({ archives, page, totalArchives })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message, 'error')
    }
  }

  componentDidMount() {
    this.loadArchives()
    this.setState({ loading: false })
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.setState({ loading: true })
      this.loadArchives()
      this.setState({ loading: false })
    }
  }

  render() {
    const { archives, page, totalArchives, loading } = this.state
    const archivesPerPage = 10
    let pageCount = Math.ceil(totalArchives / archivesPerPage)

    const loadingSpinner = <Loader inverted>Loading</Loader>

    return (
      <div>
        {loading || totalArchives == 0 ? (
          <div> {loadingSpinner} </div>
        ) : (
          <ArchivesList
            archives={archives}
            onArchiveUpdate={this.handleArchiveUpdate}
          />
        )}
        {totalArchives == 0 && (
          <div>
            {' '}
            No archives found. <Link to="add-resource">Add some</Link> or browse
            the public ones on the{' '}
            <a
              href="https://oais-registry.web.cern.ch/"
              rel="noreferrer"
              target="_blank"
            >
              Digital Memory registry
            </a>
            .
          </div>
        )}
        {totalArchives > archivesPerPage && (
          <div>
            <PageControls
              page={page}
              onChange={this.loadArchives}
              totalPages={pageCount}
            />
          </div>
        )}
      </div>
    )
  }
}
