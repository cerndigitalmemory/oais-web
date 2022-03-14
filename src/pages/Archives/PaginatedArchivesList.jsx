import { ArchivesList } from '@/pages/Archives/ArchivesList.jsx'
import { PageControls } from '@/pages/Archives/PageControls.jsx'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader } from 'semantic-ui-react'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedArchivesList extends React.Component {
  static propTypes = {
    getArchives: PropTypes.func.isRequired,
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
        await this.props.getArchives(page)
      this.setState({ archives, page, totalArchives })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message)
    }
  }

  componentDidMount() {
    this.loadArchives()
    this.setState({ loading: false })
  }

  render() {
    const { archives, page, totalArchives, loading } = this.state
    let pageCount = Math.ceil(totalArchives / 10)

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

        <div>
          <PageControls
            page={page}
            onChange={this.loadArchives}
            totalPages={pageCount}
          />
        </div>
      </div>
    )
  }
}
