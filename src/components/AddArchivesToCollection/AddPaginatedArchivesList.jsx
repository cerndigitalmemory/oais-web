import { ArchivesList } from '@/components/AddArchivesToCollection/ArchivesList.jsx'
import { PageControls } from '@/components/AddArchivesToCollection/PageControls.jsx'
import { sendNotification } from '@/utils.js'
import { collectionType, archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader } from 'semantic-ui-react'

/**
 * This component gets the archives and creates a paginated list of the archives together with the page controls.
 */
export class PaginatedArchivesList extends React.Component {
  static propTypes = {
    addArchive: PropTypes.func.isRequired,
    removeArchive: PropTypes.func.isRequired,
    loadArchives: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    totalArchives: PropTypes.number.isRequired,
    prevArchives: PropTypes.arrayOf(archiveType),
    newArchives: PropTypes.arrayOf(archiveType).isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { newArchives, page, totalArchives, prevArchives } = this.props
    let pageCount = Math.ceil(totalArchives / 10)

    return (
      <div>
        <ArchivesList
          prevArchives={prevArchives}
          newArchives={newArchives}
          addArchive={this.props.addArchive}
          removeArchive={this.props.removeArchive}
        />

        <div>
          <PageControls
            page={page}
            onChange={this.props.loadArchives}
            totalPages={pageCount}
          />
        </div>
      </div>
    )
  }
}
